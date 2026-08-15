"use client";

import React from "react";
import { Folder, Check } from "lucide-react";
import { SURFACE, SURFACE_2, BORDER, TEXT_MUTED, TEXT_FAINT, GOLD } from "../lib/constants";

export function EmptyState({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: SURFACE }}>
        <Folder size={22} color={TEXT_FAINT} />
      </div>
      <p className="text-[14px] font-medium text-white/80">{text}</p>
      {sub && <p className="text-[12.5px] mt-1" style={{ color: TEXT_MUTED }}>{sub}</p>}
    </div>
  );
}

export function Toast({ text }: { text: string }) {
  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg animate-toast"
      style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}
    >
      <Check size={14} color={GOLD} />
      <span className="text-[13px] text-white/90">{text}</span>
    </div>
  );
}
