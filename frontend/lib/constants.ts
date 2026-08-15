import {
  FileText, Image as ImageIcon, Video, Music, StickyNote, KeyRound,
  Link as LinkIcon, Folder, Star, Trash2, Pencil,
} from "lucide-react";
import type { ItemType } from "./types";

/* ---------------------------------------------------------------- */
/* Design tokens (dark premium vault)                                */
/* ---------------------------------------------------------------- */
export const GOLD = "#D9A441";
export const GOLD_SOFT = "rgba(217,164,65,0.12)";
export const BG = "#0A0A0B";
export const SURFACE = "#141416";
export const SURFACE_2 = "#1B1B1E";
export const BORDER = "#26262A";
export const TEXT_MUTED = "#8B8B92";
export const TEXT_FAINT = "#5C5C63";

export const TYPE_META: Record<ItemType | "folder", { label: string; icon: any; color: string; bg: string }> = {
  document: { label: "Documento", icon: FileText, color: "#4F8EF7", bg: "rgba(79,142,247,0.14)" },
  image: { label: "Imagen", icon: ImageIcon, color: "#33B9A5", bg: "rgba(51,185,165,0.14)" },
  video: { label: "Video", icon: Video, color: "#B15FE0", bg: "rgba(177,95,224,0.14)" },
  audio: { label: "Audio", icon: Music, color: "#5CC8F2", bg: "rgba(92,200,242,0.14)" },
  note: { label: "Nota", icon: StickyNote, color: "#8E7BF0", bg: "rgba(142,123,240,0.14)" },
  secret: { label: "Secret", icon: KeyRound, color: "#E0524F", bg: "rgba(224,82,79,0.14)" },
  link: { label: "Enlace", icon: LinkIcon, color: "#4F8EF7", bg: "rgba(79,142,247,0.14)" },
  folder: { label: "Carpeta", icon: Folder, color: GOLD, bg: GOLD_SOFT },
};

export const CATEGORY_LABEL: Record<string, string> = {
  document: "Documentos", image: "Imágenes", video: "Videos", audio: "Audio",
};

export const ADDED_LABEL: Record<string, string> = {
  document: "Documento añadido", image: "Imagen añadida", video: "Video añadido", audio: "Audio añadido",
};

export const STAT_BASE = { document: 0, note: 0, secret: 0, image: 0, video: 0, link: 0 };
export const FOLDERS = ["General"];

export const FILTERS = [
  { key: "all", label: "Todo" },
  { key: "document", label: "Documentos" },
  { key: "note", label: "Notas" },
  { key: "secret", label: "Secrets" },
  { key: "image", label: "Imágenes" },
  { key: "video", label: "Video" },
  { key: "audio", label: "Audio" },
  { key: "link", label: "Enlaces" },
];

export const ADD_OPTIONS = [
  { key: "document", label: "Documento", sub: "PDF, DOCX, TXT, etc." },
  { key: "image", label: "Imagen", sub: "JPG, PNG, GIF, etc." },
  { key: "video", label: "Video", sub: "MP4, MOV, AVI, etc." },
  { key: "audio", label: "Audio", sub: "MP3, WAV, M4A, etc." },
  { key: "note", label: "Nota", sub: "Escribe tus ideas" },
  { key: "secret", label: "Secret", sub: "Contraseñas, claves, tokens" },
  { key: "link", label: "Enlace", sub: "Guardar un enlace web" },
];

export const SECRET_TYPES = ["API Key", "Contraseña", "Token", "Certificado", "Nota segura"];

export const MEDIA_CONFIG: Record<string, { title: string; select: string; accept: string; saveLabel: string; icon: any }> = {
  image: { title: "Añadir imagen", select: "Selecciona una imagen", accept: "image/*", saveLabel: "Guardar imagen", icon: ImageIcon },
  video: { title: "Añadir video", select: "Selecciona un video", accept: "video/*", saveLabel: "Guardar video", icon: Video },
  document: { title: "Añadir documento", select: "Selecciona un documento", accept: ".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx,.csv", saveLabel: "Guardar documento", icon: FileText },
};

export const DOC_FORMATS = ["PDF", "DOCX", "TXT", "XLSX", "PPTX", "..."];

// Traduce el icon_key guardado en la tabla `activity` (texto plano)
// de vuelta a un componente de ícono para renderizar.
export const ICON_BY_KEY: Record<string, any> = {
  document: FileText, image: ImageIcon, video: Video, audio: Music,
  note: StickyNote, secret: KeyRound, link: LinkIcon,
  star: Star, trash: Trash2, pencil: Pencil,
};

