"use client";

import React from "react";
import { Lock, User } from "lucide-react";
import { useVault } from "../context/VaultContext";
import { GOLD, GOLD_SOFT, SURFACE, BORDER, TEXT_MUTED, TYPE_META } from "../../lib/constants";
import SearchBar from "./SearchBar";
import ItemRow from "./ItemRow";
import { EmptyState } from "./EmptyState";

const STAT_ORDER = ["document", "note", "secret", "image", "video", "link"];
const STAT_LABELS: Record<string, string> = {
  document: "Documentos", note: "Notas", secret: "Secrets", image: "Imágenes", video: "Videos", link: "Enlaces",
};

export default function HomeScreen() {
  const { items, stats, setScreen, setSelectedItem, setMenuItem, homeSearch, setHomeSearch } = useVault();
  const recents = items.slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: GOLD_SOFT }}>
            <Lock size={18} color={GOLD} />
          </div>
          <div className="text-white font-bold text-[16px] leading-none tracking-wide">VAULT</div>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "#1B1B1E", border: `1px solid ${BORDER}` }}>
          <User size={16} color={TEXT_MUTED} />
        </div>
      </div>

      <div className="px-5 pb-4">
        <h2 className="text-[22px] font-bold text-white leading-tight">Bienvenido 👋</h2>
        <p className="text-[13px] mt-0.5" style={{ color: TEXT_MUTED }}>Todo seguro. Todo tuyo.</p>
      </div>

      <SearchBar value={homeSearch} onChange={setHomeSearch} placeholder="Buscar en Vault" />

      <div className="flex items-center justify-between px-5 mt-6 mb-3">
        <h3 className="text-[14px] font-semibold text-white">Resumen</h3>
        <button onClick={() => setScreen("vault")} className="text-[12.5px] font-medium" style={{ color: GOLD }}>Ver todo</button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 px-5">
        {STAT_ORDER.map((t) => {
          const meta = (TYPE_META as any)[t];
          const Icon = meta.icon;
          return (
            <div key={t} className="rounded-xl px-3 py-3 flex flex-col gap-2"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
              <div className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: meta.bg }}>
                <Icon size={14} color={meta.color} />
              </div>
              <div>
                <div className="text-[16px] font-bold text-white leading-none">{stats[t].toLocaleString("es-ES")}</div>
                <div className="text-[11px] mt-1" style={{ color: TEXT_MUTED }}>{STAT_LABELS[t]}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-5 mt-7 mb-3">
        <h3 className="text-[14px] font-semibold text-white">Recientes</h3>
        {recents.length > 0 && (
          <button onClick={() => setScreen("vault")} className="text-[12.5px] font-medium" style={{ color: GOLD }}>Ver todo</button>
        )}
      </div>

      <div className="px-5 flex flex-col gap-2">
        {recents.length === 0 ? (
          <EmptyState text="Tu Vault está vacío" sub="Toca “+” para añadir tu primer elemento" />
        ) : (
          recents.map((it) => (
            <ItemRow key={it.id} item={it} onClick={() => setSelectedItem(it)} onMenu={setMenuItem} />
          ))
        )}
      </div>
    </div>
  );
}
