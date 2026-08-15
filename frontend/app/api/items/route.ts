import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase";
import { encryptSecret } from "../../../lib/crypto";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Nunca devolvemos el valor cifrado del secret en el listado general.
  const safe = (data || []).map((it) => {
    const { secret_value_encrypted, ...rest } = it;
    return { ...rest, hasSecretValue: !!secret_value_encrypted };
  });

  return NextResponse.json({ items: safe });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const body = await req.json();

  const row: Record<string, any> = {
    type: body.type,
    name: body.name,
    meta: body.meta ?? null,
    date: body.date,
    favorite: body.favorite ?? false,
    folder: body.folder ?? "General",
    size: body.size ?? null,
    content: body.content ?? null,
    tags: body.tags ?? null,
    secret_type: body.secretType ?? null,
    project: body.project ?? null,
    notes: body.notes ?? null,
    url: body.url ?? null,
    file_path: body.filePath ?? null,
  };

  if (body.type === "secret" && body.value) {
    row.secret_value_encrypted = encryptSecret(body.value);
  }

  const { data, error } = await supabase.from("items").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { secret_value_encrypted, ...safe } = data;
  return NextResponse.json({ item: { ...safe, hasSecretValue: !!secret_value_encrypted } });
    }
