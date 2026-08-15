"use client";

import React, { useState } from "react";
import type { VaultItem } from "../../lib/types";
import { GOLD, SURFACE, BORDER, TEXT_MUTED } from "../../lib/constants";

export default function RenameModal({
  item, onCancel, onSave,
}: {
  item: VaultItem;
  onCancel: () => void;
  onSave: (newName: string) => void;
}) {
  const [name, setName] = useState(item.name);

  return (
    <div className="fixed inset-0 z-[55] flex items-end lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative w-full lg:max-w-sm lg:rounded-2xl rounded-t-2xl px-5 pt-3 pb-6 animate-sheet"
        style={{ background: "#111113", border: `1px solid ${BORDER}`, borderBottom: "none" }}>
        <div className="flex justify-center pt-1 pb-3 lg:hidden">
          <div className="w-9 h-1 rounded-full" style={{ background: BORDER }} />
        </div>
        <h3 className="text-[15px] font-semibold text-white mb-4 px-1">Renombrar elemento</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} autoFocus
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onSave(name.trim())}
          className="w-full rounded-xl px-3.5 py-3 text-[14px] text-white outline-none mb-4"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }} />
        <div className="flex gap-2.5">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-[13.5px] font-medium"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT_MUTED }}>
            Cancelar
          </button>
          <button onClick={() => name.trim() && onSave(name.trim())} disabled={!name.trim()}
            className="flex-1 py-3 rounded-xl text-[13.5px] font-semibold disabled:opacity-40"
            style={{ background: GOLD, color: "#161208" }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
