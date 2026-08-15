"use client";

import React from "react";
import { TYPE_META } from "../lib/constants";

export default function IconBadge({ type, size = 38 }: { type: string; size?: number }) {
  const meta = (TYPE_META as any)[type] || TYPE_META.document;
  const Icon = meta.icon;
  return (
    <div
      className="flex items-center justify-center rounded-[11px] shrink-0"
      style={{ width: size, height: size, background: meta.bg }}
    >
      <Icon size={size * 0.48} color={meta.color} strokeWidth={2} />
    </div>
  );
}
