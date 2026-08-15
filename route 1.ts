import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, VAULT_BUCKET } from "../lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No se envió ningún archivo." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(VAULT_BUCKET)
    .upload(path, Buffer.from(arrayBuffer), { contentType: file.type });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ filePath: path, size: file.size });
}
