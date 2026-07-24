/**
 * DPoP (Demonstrating Proof of Possession) — sender-constrained tokens.
 * Generates an ECDSA P-256 key pair (non-extractable private key) and
 * produces fresh proof JWTs per request. Toggle via apiConfig.dpopEnabled.
 */

const DB_NAME = "harava-dpop";
const STORE_NAME = "keys";
const KEY_ID = "dpop-keypair";

// ─── Base64url helpers ─────────────────────────────────────────────────────

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ─── IndexedDB persistence ─────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadKeyPair(): Promise<CryptoKeyPair | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(KEY_ID);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function saveKeyPair(kp: CryptoKeyPair): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(kp, KEY_ID);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ─── Key pair management ───────────────────────────────────────────────────

let cachedKeyPair: CryptoKeyPair | null = null;

export async function getOrCreateKeyPair(): Promise<CryptoKeyPair> {
  if (cachedKeyPair) return cachedKeyPair;

  // Try loading from IndexedDB first
  const stored = await loadKeyPair();
  if (stored) {
    cachedKeyPair = stored;
    return stored;
  }

  // Generate new non-extractable key pair
  const kp = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    false, // non-extractable — the whole point
    ["sign"]
  );
  await saveKeyPair(kp);
  cachedKeyPair = kp;
  return kp;
}

/** Wipe the stored key pair (e.g. on logout or DPoP re-enrollment) */
export async function clearKeyPair(): Promise<void> {
  cachedKeyPair = null;
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(KEY_ID);
  } catch {
    // Ignore — key may not exist
  }
}

// ─── Proof generation ──────────────────────────────────────────────────────

/**
 * Generate a DPoP proof JWT for the given request.
 * @param method HTTP method (GET, POST, etc.)
 * @param url Full request URL
 * @param accessToken Optional — include `ath` claim to bind proof to token
 */
export async function createDpopProof(
  method: string,
  url: string,
  accessToken?: string | null
): Promise<string> {
  const kp = await getOrCreateKeyPair();

  // Export public key as JWK (only x, y, crv, kty)
  const jwkFull = await crypto.subtle.exportKey("jwk", kp.publicKey!);
  const jwk = { crv: "P-256", kty: "EC", x: jwkFull.x, y: jwkFull.y };

  const header = { typ: "dpop+jwt", alg: "ES256", jwk };
  const payload: Record<string, unknown> = {
    htm: method.toUpperCase(),
    htu: url,
    iat: Math.floor(Date.now() / 1000),
    jti: crypto.randomUUID(),
  };

  // Bind proof to the specific access token
  if (accessToken) {
    const ath = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(accessToken)
    );
    payload.ath = b64url(ath);
  }

  const enc = (o: unknown) => b64url(new TextEncoder().encode(JSON.stringify(o)));
  const signingInput = `${enc(header)}.${enc(payload)}`;

  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    kp.privateKey!,
    new TextEncoder().encode(signingInput)
  );

  return `${signingInput}.${b64url(sig)}`;
}
