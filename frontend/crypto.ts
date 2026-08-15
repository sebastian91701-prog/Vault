import crypto from "crypto";

// Deriva una clave de 32 bytes a partir de la frase en SECRET_ENCRYPTION_KEY
function getKey(): Buffer {
  const passphrase = process.env.SECRET_ENCRYPTION_KEY;
  if (!passphrase) {
    throw new Error("Falta SECRET_ENCRYPTION_KEY en las variables de entorno.");
  }
  return crypto.createHash("sha256").update(passphrase).digest();
}

/**
 * Cifra un texto (la clave/token de un secret) con AES-256-GCM.
 * Devuelve una cadena base64 que incluye iv + authTag + contenido cifrado,
 * lista para guardar en la columna `secret_value_encrypted` (text).
 */
export function encryptSecret(plainText: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

/**
 * Descifra un valor generado por encryptSecret().
 */
export function decryptSecret(payloadBase64: string): string {
  const key = getKey();
  const raw = Buffer.from(payloadBase64, "base64");
  const iv = raw.subarray(0, 12);
  const authTag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
