import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, VAULT_BUCKET } from "../lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServer();
  const body = await req.json();

  const update: Record<string, any> = {};
  if (typeof body.name === "string") update.name = body.name;
  if (typeof body.favorite === "boolean") update.favorite = body.favorite;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("items")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { secret_value_encrypted, ...safe } = data;
  return NextResponse.json({ item: { ...safe, hasSecretValue: !!secret_value_encrypted } });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServer();

  // Si el elemento tenía un archivo real en Storage, lo borramos también.
  const { data: existing } = await supabase.from("items").select("file_path").eq("id", params.id).single();
  if (existing?.file_path) {
    await supabase.storage.from(VAULT_BUCKET).remove([existing.file_path]);
  }

  const { error } = await supabase.from("items").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
