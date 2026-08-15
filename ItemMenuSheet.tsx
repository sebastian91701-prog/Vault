"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { VaultItem } from "../../lib/types";
import { SURFACE, BORDER, TEXT_MUTED } from "../../lib/constants";
import IconBadge from "../IconBadge";

export default function ItemMenuSheet({
  item, onClose, onRename, onDelete,
}: {
  item: VaultItem;
  onClose: () => void;
  onRename: (item: VaultItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[55] flex items-end lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full lg:max-w-sm lg:rounded-2xl rounded-t-2xl px-5 pt-3 pb-6 animate-sheet"
        style={{ background: "#111113", border: `1px solid ${BORDER}`, borderBottom: "none" }}>
        <div className="flex justify-center pt-1 pb-3 lg:hidden">
          <div className="w-9 h-1 rounded-full" style={{ background: BORDER }} />
        </div>
        <div className="flex items-center gap-3 px-1 pb-4 mb-1" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <IconBadge type={item.type} size={36} />
          <div className="min-w-0">
            <div className="text-[13.5px] font-medium text-white truncate max-w-[220px]">{item.name}</div>
            <div className="text-[11.5px]" style={{ color: TEXT_MUTED }}>{item.meta}</div>
          </div>
        </div>
        <button onClick={() => onRename(item)}
          className="w-full flex items-center gap-3 py-3.5 text-left active:opacity-70">
          <Pencil size={17} color="white" />
          <span className="text-[14px] text-white">Renombrar</span>
        </button>
        <button onClick={() => onDelete(item.id)}
          className="w-full flex items-center gap-3 py-3.5 text-left active:opacity-70">
          <Trash2 size={17} color="#E0524F" />
          <span className="text-[14px]" style={{ color: "#E0524F" }}>Eliminar</span>
        </button>
        <button onClick={onClose}
          className="w-full mt-2 py-3 rounded-xl text-[13.5px] font-medium"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT_MUTED }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
