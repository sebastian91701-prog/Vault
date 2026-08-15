"use client";

import React from "react";
import { Search } from "lucide-react";
import { SURFACE, BORDER, TEXT_FAINT } from "../lib/constants";

export default function SearchBar({
  value, onChange, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mx-5 mb-1"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <Search size={16} color={TEXT_FAINT} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-[14px] text-white placeholder:text-[#5C5C63] flex-1"
      />
    </div>
  );
}
