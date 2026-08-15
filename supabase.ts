import { createClient } from "@supabase/supabase-js";

// Este cliente usa la service_role key: tiene permisos totales y
// SOLO debe importarse dentro de app/api/* (código de servidor).
// Nunca lo importes desde un componente "use client".
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export const VAULT_BUCKET = "vault-files";
