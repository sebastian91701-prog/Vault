import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, VAULT_BUCKET } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const body = await req.json();
  const fileName = body.fileName as string;

  if (!fileName) {
    return NextResponse.json({ error: "Falta el nombre del archivo." }, { status: 400 });
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from(VAULT_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "No se pudo generar la URL de subida." }, { status: 500 });
  }

  return NextResponse.json({ path: data.path, token: data.token });
}
