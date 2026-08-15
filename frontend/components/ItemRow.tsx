"use client";

import React from "react";
import { Star, MoreVertical } from "lucide-react";
import type { VaultItem } from "../lib/types";
import { SURFACE, BORDER, TEXT_MUTED, TEXT_FAINT, GOLD } from "../lib/constants";
import IconBadge from "./IconBadge";

export default function ItemRow({
  item, onClick, onMenu,
}: {
  item: VaultItem;
  onClick: () => void;
  onMenu?: (item: VaultItem) => void;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-colors active:opacity-80 cursor-pointer"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <IconBadge type={item.type} size={38} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13.5px] font-medium text-white truncate">{item.name}</span>
          {item.favorite && <Star size={12} fill={GOLD} color={GOLD} className="shrink-0" />}
        </div>
        <div className="text-[11.5px] truncate mt-0.5" style={{ color: TEXT_MUTED }}>
          {item.meta}{item.size ? ` · ${item.size}` : ""}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[11px]" style={{ color: TEXT_FAINT }}>{item.date}</span>
        {onMenu && (
          <button onClick={(e) => { e.stopPropagation(); onMenu(item); }} className="p-1 -mr-1.5 active:opacity-60">
            <MoreVertical size={15} color={TEXT_FAINT} />
          </button>
        )}
      </div>
    </div>
  );
}
