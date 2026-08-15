"use client";

import React from "react";
import { Check } from "lucide-react";
import { BORDER, TEXT_MUTED } from "../lib/constants";
import GoldButton from "./GoldButton";

export default function SuccessOverlay({
  title, message, onOk,
}: {
  title: string;
  message: string;
  onOk: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full lg:max-w-sm lg:rounded-2xl rounded-t-2xl px-6 pt-8 pb-6 flex flex-col items-center text-center animate-sheet"
        style={{ background: "#111113", border: `1px solid ${BORDER}`, borderBottom: "none" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(63,191,111,0.14)" }}>
          <Check size={26} color="#3FBF6F" strokeWidth={2.5} />
        </div>
        <h3 className="text-[16px] font-semibold text-white">{title}</h3>
        <p className="text-[13px] mt-2 leading-relaxed" style={{ color: TEXT_MUTED }}>{message}</p>
        <div className="w-full mt-6">
          <GoldButton onClick={onOk}>OK</GoldButton>
        </div>
      </div>
    </div>
  );
}
