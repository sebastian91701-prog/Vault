import type { LucideIcon } from "lucide-react";

export type ItemType =
  | "document"
  | "image"
  | "video"
  | "audio"
  | "note"
  | "secret"
  | "link";

export interface VaultItem {
  id: string;
  type: ItemType;
  name: string;
  meta: string;
  date: string;
  favorite: boolean;
  folder: string;
  size?: string;
  content?: string;
  tags?: string[];
  secret_type?: string;
  hasSecretValue?: boolean;
  project?: string;
  notes?: string;
  url?: string;
  file_path?: string;
  created_at?: string;
}

export interface ActivityEntry {
  id: string;
  icon_key: string;
  action: string;
  item_name: string;
  created_at: string;
}

export type Screen = "home" | "vault" | "activity" | "profile";

export type Flow = "add" | "note" | "secret" | "image" | "video" | "document" | null;

export interface SuccessInfo {
  kind: ItemType;
  title: string;
  folder?: string;
}

export type StatCounts = Record<"document" | "note" | "secret" | "image" | "video" | "link", number>;
