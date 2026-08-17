import type { VaultItem, ActivityEntry } from "./types";
import { getSupabaseBrowser, VAULT_BUCKET } from "./supabase-browser";

async function json(res: Response) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error de red");
  return data;
}

export async function apiListItems(): Promise<VaultItem[]> {
  const data = await json(await fetch("/api/items"));
  return data.items;
}

export async function apiCreateItem(payload: Record<string, any>): Promise<VaultItem> {
  const data = await json(await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  return data.item;
}

export async function apiUpdateItem(id: string, payload: Record<string, any>): Promise<VaultItem> {
  const data = await json(await fetch(`/api/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  return data.item;
}

export async function apiDeleteItem(id: string): Promise<void> {
  await json(await fetch(`/api/items/${id}`, { method: "DELETE" }));
}

export async function apiRevealSecret(id: string): Promise<string> {
  const data = await json(await fetch(`/api/items/${id}/reveal`));
  return data.value;
}

export async function apiListActivity(): Promise<ActivityEntry[]> {
  const data = await json(await fetch("/api/activity"));
  return data.activity;
}

export async function apiLogActivity(action: string, itemName: string, iconKey: string): Promise<void> {
  await json(await fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, itemName, iconKey }),
  }));
}

export async function apiUploadFile(file: File): Promise<{ filePath: string; size: number }> {
  // 1. Le pedimos a nuestro backend un permiso temporal de subida (texto, sin límite de tamaño)
  const signRes = await json(await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name }),
  }));

  // 2. Subimos el archivo real directo a Supabase Storage — Vercel ya no participa aquí
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.storage
    .from(VAULT_BUCKET)
    .uploadToSignedUrl(signRes.path, signRes.token, file);

  if (error) throw new Error(error.message);

  return { filePath: signRes.path, size: file.size };
}

export async function apiSignedUrl(path: string): Promise<string> {
  const data = await json(await fetch(`/api/files/signed-url?path=${encodeURIComponent(path)}`));
  return data.url;
}
