"use client";

import React from "react";
import { GOLD } from "../lib/constants";

export default function GoldButton({
  children, onClick, className = "", type = "button", disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 rounded-xl font-semibold text-[15px] transition-all active:scale-[0.98] disabled:opacity-40 ${className}`}
      style={{ background: disabled ? "#3a3a3a" : GOLD, color: "#161208" }}
    >
      {children}
    </button>
  );
}
