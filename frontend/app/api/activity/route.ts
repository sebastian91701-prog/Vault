import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activity: data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const body = await req.json();

  const { data, error } = await supabase
    .from("activity")
    .insert({
      action: body.action,
      item_name: body.itemName,
      icon_key: body.iconKey,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}
