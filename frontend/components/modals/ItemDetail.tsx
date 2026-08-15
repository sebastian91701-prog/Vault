"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff, Link as LinkIcon, Star, Trash2 } from "lucide-react";
import type { VaultItem } from "../../lib/types";
import { GOLD, SURFACE, SURFACE_2, BORDER, TEXT_MUTED, TEXT_FAINT, TYPE_META } from "../../lib/constants";
import { apiRevealSecret } from "../../lib/api-client";
import IconBadge from "../IconBadge";

export default function ItemDetail({
  item, onClose, onToggleFav, onDelete,
}: {
  item: VaultItem;
  onClose: () => void;
  onToggleFav: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [reveal, setReveal] = useState(false);
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const meta = (TYPE_META as any)[item.type];
  const Icon = meta.icon;

  const handleReveal = async () => {
    if (reveal) { setReveal(false); return; }
    if (revealedValue) { setReveal(true); return; }
    setRevealing(true);
    try {
      const value = await apiRevealSecret(item.id);
      setRevealedValue(value);
      setReveal(true);
    } catch {
      setRevealedValue(null);
    } finally {
      setRevealing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full lg:max-w-md lg:rounded-2xl rounded-t-2xl px-5 pt-3 pb-6 animate-sheet sheet-85 overflow-y-auto no-scrollbar"
        style={{ background: "#111113", border: `1px solid ${BORDER}`, borderBottom: "none" }}>
        <div className="flex justify-center pt-1 pb-3 lg:hidden">
          <div className="w-9 h-1 rounded-full" style={{ background: BORDER }} />
        </div>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <IconBadge type={item.type} size={44} />
            <div>
              <div className="text-[15px] font-semibold text-white leading-tight max-w-[220px]">{item.name}</div>
              <div className="text-[12px] mt-0.5" style={{ color: TEXT_MUTED }}>{item.meta}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1"><X size={18} color={TEXT_MUTED} /></button>
        </div>

        {item.type === "note" && (
          <div className="rounded-xl px-4 py-3.5 mb-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <p className="text-[13.5px] text-white/85 whitespace-pre-line leading-relaxed">{item.content}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {item.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-[11px]" style={{ background: SURFACE_2, color: TEXT_MUTED }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {item.type === "secret" && (
          <div className="rounded-xl px-4 py-3.5 mb-4 flex flex-col gap-3" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between">
              <span className="text-[12px]" style={{ color: TEXT_MUTED }}>{item.secret_type || "Secret"}</span>
              <button onClick={handleReveal} disabled={revealing} className="flex items-center gap-1.5 text-[12px] font-medium disabled:opacity-50" style={{ color: GOLD }}>
                {reveal ? <EyeOff size={13} /> : <Eye size={13} />} {revealing ? "Cargando..." : reveal ? "Ocultar" : "Revelar"}
              </button>
            </div>
            <div className="text-[14px] font-mono text-white tracking-wider break-all">
              {reveal && revealedValue ? revealedValue : "•".repeat(24)}
            </div>
            {item.project && <div className="text-[12px]" style={{ color: TEXT_MUTED }}>Proyecto: <span className="text-white/80">{item.project}</span></div>}
            {item.notes && <div className="text-[12.5px] pt-2 border-t" style={{ color: TEXT_MUTED, borderColor: BORDER }}>{item.notes}</div>}
          </div>
        )}

        {item.type === "link" && (
          <div className="rounded-xl px-4 py-3.5 mb-4 flex items-center gap-2" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <LinkIcon size={14} color="#4F8EF7" />
            <span className="text-[13.5px] text-[#4F8EF7]">{item.url}</span>
          </div>
        )}

        {["document", "image", "video", "audio"].includes(item.type) && (
          <div className="rounded-xl px-4 py-6 mb-4 flex flex-col items-center gap-2" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <Icon size={28} color={meta.color} />
            <span className="text-[12px]" style={{ color: TEXT_MUTED }}>{item.size} · {item.date}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={() => onToggleFav(item.id)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: item.favorite ? GOLD : "white" }}>
            <Star size={15} fill={item.favorite ? GOLD : "none"} color={item.favorite ? GOLD : TEXT_MUTED} />
            {item.favorite ? "En favoritos" : "Añadir a favoritos"}
          </button>
          <button onClick={() => onDelete(item.id)} className="p-3.5 rounded-xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <Trash2 size={15} color="#E0524F" />
          </button>
        </div>
        <div className="text-[11px] text-center mt-4" style={{ color: TEXT_FAINT }}>{item.date}</div>
      </div>
    </div>
  );
}
