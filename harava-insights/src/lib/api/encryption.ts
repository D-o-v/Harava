/**
 * AES-256-GCM payload encryption (toggleable).
 * Wire format: base64( IV[12] || ciphertext || GCM-tag[16] )
 * Web Crypto appends the tag to ciphertext automatically.
 */

import { apiConfig } from "./config";

let cryptoKey: CryptoKey | null = null;

/** Import the shared 32-byte key (base64-encoded) into a CryptoKey */
async function getKey(): Promise<CryptoKey> {
  if (cryptoKey) return cryptoKey;

  const keyBytes = Uint8Array.from(atob(apiConfig.encryptionKey), (c) =>
    c.charCodeAt(0)
  );

  cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
  return cryptoKey;
}

/** Encrypt a JS object → base64 envelope */
export async function encryptPayload(bodyObj: unknown): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const pt = new TextEncoder().encode(JSON.stringify(bodyObj));
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, pt)
  );
  // IV || ciphertext+tag
  const envelope = new Uint8Array(iv.length + ct.length);
  envelope.set(iv, 0);
  envelope.set(ct, iv.length);
  return btoa(String.fromCharCode(...envelope));
}

/** Decrypt a base64 envelope → parsed JSON */
export async function decryptPayload<T = unknown>(base64: string): Promise<T> {
  const key = await getKey();
  const envelope = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const iv = envelope.slice(0, 12);
  const ct = envelope.slice(12);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return JSON.parse(new TextDecoder().decode(pt));
}
