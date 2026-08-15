import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, VAULT_BUCKET } from "../../../../lib/supabase";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Falta el parámetro path." }, { status: 400 });

  const supabase = getSupabaseServer();
  const { data, error } = await supabase.storage
    .from(VAULT_BUCKET)
    .createSignedUrl(path, 60 * 10); // 10 minutos

  if (error || !data) return NextResponse.json({ error: error?.message || "No se pudo generar la URL." }, { status: 500 });

  return NextResponse.json({ url: data.signedUrl });
}
