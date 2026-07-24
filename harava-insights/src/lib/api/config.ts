// API configuration — toggle security layers here

const rawTenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim() || "";
const placeholderTenantId = ["your-tenant-id-here", "tenant-id", "placeholder", "changeme"].includes(rawTenantId.toLowerCase());

export const apiConfig = {
  /** Base URL for the backend API */
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://185.113.249.47:8080",

  /** Optional tenant ID sent as X-Tenant-ID for tenant-scoped requests */
  tenantId: placeholderTenantId ? "" : rawTenantId,

  /** Enable AES-256-GCM payload encryption (server: harava.payload-encryption.enabled) */
  payloadEncryption: process.env.NEXT_PUBLIC_PAYLOAD_ENCRYPTION === "true",

  /** Enable DPoP sender-constrained tokens (server: harava.dpop.enabled) */
  dpopEnabled: process.env.NEXT_PUBLIC_DPOP_ENABLED === "true",

  /** Shared encryption key (base64-encoded 32-byte key, for dev/staging only) */
  encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "",
};
