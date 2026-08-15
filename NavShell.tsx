"use client";

import React from "react";
import { Home, Lock, Plus, Clock, User } from "lucide-react";
import type { Screen } from "../lib/types";
import { GOLD, GOLD_SOFT, BG, SURFACE, BORDER, TEXT_MUTED, TEXT_FAINT } from "../lib/constants";

const NAV_ITEMS = [
  { key: "home", label: "Inicio", icon: Home },
  { key: "vault", label: "Vault", icon: Lock },
  { key: "add", label: "", icon: Plus, isAdd: true },
  { key: "activity", label: "Actividad", icon: Clock },
  { key: "profile", label: "Perfil", icon: User },
];

export default function NavShell({
  active, onNav, onAdd, children,
}: {
  active: Screen;
  onNav: (s: Screen) => void;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 shrink-0 py-6 px-4 gap-1"
        style={{ background: SURFACE, borderRight: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: GOLD_SOFT }}>
            <Lock size={18} color={GOLD} />
          </div>
          <span className="text-white font-bold text-[17px] tracking-wide">VAULT</span>
        </div>
        {NAV_ITEMS.filter((n) => !n.isAdd).map((n) => {
          const Icon = n.icon;
          const isActive = active === n.key;
          return (
            <button key={n.key} onClick={() => onNav(n.key as Screen)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors"
              style={{ background: isActive ? GOLD_SOFT : "transparent", color: isActive ? GOLD : TEXT_MUTED }}>
              <Icon size={18} strokeWidth={2} />
              {n.label}
            </button>
          );
        })}
        <button onClick={onAdd}
          className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-[14px] font-semibold"
          style={{ background: GOLD, color: "#161208" }}>
          <Plus size={18} strokeWidth={2.5} />
          Añadir
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative" style={{ background: BG }}>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 lg:pb-6">{children}</div>

        {/* Mobile bottom nav */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 pt-2 pb-2"
          style={{ background: "rgba(10,10,11,0.92)", backdropFilter: "blur(14px)", borderTop: `1px solid ${BORDER}` }}>
          {NAV_ITEMS.map((n) => {
            const Icon = n.icon;
            const isActive = active === n.key;
            if (n.isAdd) {
              return (
                <button key={n.key} onClick={onAdd} className="flex flex-col items-center -mt-5 active:scale-95 transition-transform">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: GOLD, boxShadow: "0 4px 18px rgba(217,164,65,0.35)" }}>
                    <Plus size={26} color="#161208" strokeWidth={2.5} />
                  </div>
                </button>
              );
            }
            return (
              <button key={n.key} onClick={() => onNav(n.key as Screen)} className="flex flex-col items-center gap-1 py-1.5 min-w-[52px] active:opacity-70">
                <Icon size={20} color={isActive ? GOLD : TEXT_FAINT} strokeWidth={2} />
                <span className="text-[10.5px] font-medium" style={{ color: isActive ? GOLD : TEXT_FAINT }}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
