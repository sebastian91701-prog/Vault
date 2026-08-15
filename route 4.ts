import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "../lib/supabase";
import { decryptSecret } from "../lib/crypto";

// Ruta separada a propósito: el valor descifrado del secret
// solo viaja al navegador cuando el usuario pulsa "Revelar",
// nunca como parte del listado general de items.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("items")
    .select("secret_value_encrypted")
    .eq("id", params.id)
    .single();

  if (error || !data?.secret_value_encrypted) {
    return NextResponse.json({ error: "Secret no encontrado." }, { status: 404 });
  }

  const value = decryptSecret(data.secret_value_encrypted);
  return NextResponse.json({ value });
}
