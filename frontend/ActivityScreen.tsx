"use client";

import React from "react";
import { useVault } from "../context/VaultContext";
import { GOLD, SURFACE, BORDER, TEXT_MUTED, TEXT_FAINT, ICON_BY_KEY } from "../../lib/constants";
import TopBar from "../TopBar";
import { EmptyState } from "../EmptyState";

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Hoy, ${time}`;
  return `${d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}, ${time}`;
}

export default function ActivityScreen() {
  const { activity } = useVault();

  return (
    <div>
      <TopBar title="Actividad" />
      <p className="px-5 text-[13px] -mt-2 mb-5" style={{ color: TEXT_MUTED }}>Historial de acciones recientes en tu Vault.</p>
      {activity.length === 0 && <EmptyState text="Aún no hay actividad" sub="Las acciones que realices en tu Vault aparecerán aquí" />}
      <div className="px-5 relative">
        {activity.length > 0 && <div className="absolute left-[27px] top-2 bottom-2 w-px" style={{ background: BORDER }} />}
        <div className="flex flex-col gap-4">
          {activity.map((a) => {
            const Icon = ICON_BY_KEY[a.icon_key] || ICON_BY_KEY.document;
            return (
              <div key={a.id} className="flex items-start gap-3.5 relative">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                  <Icon size={15} color={GOLD} />
                </div>
                <div className="flex-1 pt-1.5 pb-2 border-b" style={{ borderColor: "rgba(38,38,42,0.5)" }}>
                  <div className="text-[13.5px] text-white/90"><span className="font-medium">{a.action}</span></div>
                  <div className="text-[12.5px] mt-0.5" style={{ color: TEXT_MUTED }}>{a.item_name}</div>
                  <div className="text-[11px] mt-1" style={{ color: TEXT_FAINT }}>{formatWhen(a.created_at)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
