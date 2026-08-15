export const uid = () => Math.random().toString(36).slice(2, 10);

export function nowStamp(): string {
  const d = new Date();
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export function formatBytes(bytes?: number): string {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatDuration(sec: number | null): string | null {
  if (!sec || !isFinite(sec)) return null;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function strengthOf(v: string) {
  if (v.length > 16) return { label: "Muy segura", pct: 100, color: "#3FBF6F" };
  if (v.length > 8) return { label: "Segura", pct: 65, color: "#D9A441" };
  if (v.length > 0) return { label: "Débil", pct: 30, color: "#E0524F" };
  return { label: "Sin definir", pct: 0, color: "#5C5C63" };
}

export function genSecret(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let s = "sk-";
  for (let i = 0; i < 24; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
