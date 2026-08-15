"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

export default function TopBar({
  title, onBack, right,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-1 -ml-1 text-white/80 active:opacity-60">
            <ChevronLeft size={22} />
          </button>
        )}
        <h1 className="text-[19px] font-semibold text-white tracking-tight">{title}</h1>
      </div>
      {right}
    </div>
  );
}
