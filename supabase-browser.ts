import { createClient } from "@supabase/supabase-js";

export const VAULT_BUCKET = "vault-files";

// Este cliente usa la clave pública (anon) — es seguro que viva en el
// navegador. Se usa solo para subir archivos directo a Storage con
// una URL firmada temporal que el backend genera primero.
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en el entorno.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
