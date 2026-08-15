"use client";

import React, { useMemo } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useVault } from "../../context/VaultContext";
import { GOLD, SURFACE, BORDER, TEXT_MUTED, TEXT_FAINT, FILTERS } from "../../lib/constants";
import TopBar from "../TopBar";
import SearchBar from "../SearchBar";
import ItemRow from "../ItemRow";
import { EmptyState } from "../EmptyState";

export default function VaultScreen() {
  const { items, setSelectedItem, setMenuItem, vaultSearch, setVaultSearch, filter, setFilter } = useVault();

  const filtered = useMemo(() => {
    let list = items;
    if (filter !== "all") list = list.filter((i) => i.type === filter);
    if (vaultSearch.trim()) list = list.filter((i) => i.name.toLowerCase().includes(vaultSearch.toLowerCase()));
    return list;
  }, [items, filter, vaultSearch]);

  return (
    <div>
      <TopBar title="Vault" right={<SlidersHorizontal size={18} color={TEXT_MUTED} />} />
      <SearchBar value={vaultSearch} onChange={setVaultSearch} placeholder="Buscar en Vault" />

      <div className="flex gap-2 px-5 mt-4 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium whitespace-nowrap shrink-0 transition-colors"
              style={{ background: active ? GOLD : SURFACE, color: active ? "#161208" : TEXT_MUTED, border: `1px solid ${active ? GOLD : BORDER}` }}>
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-5 mt-5 mb-2">
        <button className="flex items-center gap-1 text-[12px] font-medium" style={{ color: TEXT_MUTED }}>
          Más recientes <ChevronDown size={13} />
        </button>
        <span className="text-[12px]" style={{ color: TEXT_FAINT }}>{filtered.length} elementos</span>
      </div>

      <div className="px-5 flex flex-col gap-2 mt-1">
        {filtered.length === 0 ? (
          items.length === 0 ? (
            <EmptyState text="Tu Vault está vacío" sub="Toca “+” para añadir tu primer documento, nota o secret" />
          ) : (
            <EmptyState text="No hay elementos que coincidan" sub="Prueba con otra búsqueda o filtro" />
          )
        ) : (
          filtered.map((it) => (
            <ItemRow key={it.id} item={it} onClick={() => setSelectedItem(it)} onMenu={setMenuItem} />
          ))
        )}
      </div>
    </div>
  );
}
