"use client";

import React, { useState } from "react";
import {
  User, Fingerprint, Shield, Bell, Palette, HardDrive, Smartphone,
  LogOut, ChevronRight,
} from "lucide-react";
import { GOLD, SURFACE, SURFACE_2, BORDER, TEXT_MUTED, TEXT_FAINT } from "../lib/constants";
import TopBar from "./TopBar";

function Row({
  icon: Icon, label, sub, right, onClick,
}: {
  icon: any; label: string; sub?: string; right?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      style={{ borderBottom: `1px solid ${BORDER}` }}>
      <div className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0" style={{ background: SURFACE_2 }}>
        <Icon size={15} color={GOLD} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] text-white">{label}</div>
        {sub && <div className="text-[11.5px] mt-0.5" style={{ color: TEXT_MUTED }}>{sub}</div>}
      </div>
      {right}
    </button>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} className="w-10 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors"
      style={{ background: on ? GOLD : BORDER, justifyContent: on ? "flex-end" : "flex-start" }}>
      <div className="w-5 h-5 rounded-full bg-white" />
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <div className="px-5 mb-2 text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: TEXT_FAINT }}>{text}</div>;
}

export default function ProfileScreen() {
  const [biometric, setBiometric] = useState(true);
  const [notif, setNotif] = useState(true);

  return (
    <div>
      <TopBar title="Perfil" />
      <div className="flex flex-col items-center px-5 pb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
          style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}>
          <User size={24} color={TEXT_MUTED} />
        </div>
        <div className="text-[16px] font-semibold text-white">Tu cuenta</div>
        <div className="text-[12.5px]" style={{ color: TEXT_MUTED }}>Configura tu perfil</div>
      </div>

      <SectionLabel text="Seguridad" />
      <div className="mx-5 rounded-xl overflow-hidden mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <Row icon={Fingerprint} label="Biometría / PIN" sub="Desbloquear con huella o rostro" right={<Toggle on={biometric} onClick={() => setBiometric(!biometric)} />} />
        <Row icon={Shield} label="Autenticación en dos pasos" sub="Activada" right={<ChevronRight size={16} color={TEXT_FAINT} />} />
        <Row icon={Bell} label="Notificaciones de seguridad" right={<Toggle on={notif} onClick={() => setNotif(!notif)} />} />
      </div>

      <SectionLabel text="Preferencias" />
      <div className="mx-5 rounded-xl overflow-hidden mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <Row icon={Palette} label="Apariencia" sub="Oscuro" right={<ChevronRight size={16} color={TEXT_FAINT} />} />
        <Row icon={HardDrive} label="Configuración de Vault" sub="Copias de seguridad, cifrado" right={<ChevronRight size={16} color={TEXT_FAINT} />} />
      </div>

      <SectionLabel text="Dispositivos" />
      <div className="mx-5 rounded-xl overflow-hidden mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <Row icon={Smartphone} label="Este dispositivo" sub="Activo ahora" />
      </div>

      <div className="px-5">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#E0524F" }}>
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
