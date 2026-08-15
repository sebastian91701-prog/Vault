"use client";

import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, RefreshCw, Folder, ChevronRight, ChevronDown } from "lucide-react";
import { useVault } from "../../context/VaultContext";
import { SURFACE, BORDER, TEXT_MUTED, TEXT_FAINT, GOLD, FOLDERS, SECRET_TYPES } from "../../lib/constants";
import { strengthOf, genSecret } from "../../lib/utils";
import TopBar from "../TopBar";
import GoldButton from "../GoldButton";

export default function SecretEditor({ onCancel }: { onCancel: () => void }) {
  const { saveSecret } = useVault();
  const [type, setType] = useState(SECRET_TYPES[0]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [project, setProject] = useState(FOLDERS[0]);
  const [notes, setNotes] = useState("");
  const strength = strengthOf(value);

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Nuevo secret" onBack={onCancel} right={
        <button onClick={onCancel} className="text-[13.5px] font-medium" style={{ color: TEXT_MUTED }}>Cancelar</button>
      } />
      <div className="px-5 flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar">
        <div>
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Tipo de secret</label>
          <div className="relative">
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full appearance-none rounded-xl pl-11 pr-9 py-3 text-[14px] text-white outline-none"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
              {SECRET_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <KeyRound size={16} color="#E0524F" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown size={15} color={TEXT_FAINT} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="p. ej. Anthropic API Key"
            className="w-full rounded-xl px-3.5 py-3 text-[14px] text-white outline-none placeholder:text-[#5C5C63]"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }} />
        </div>
        <div>
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Clave / Token</label>
          <div className="relative">
            <input type={show ? "text" : "password"} value={value} onChange={(e) => setValue(e.target.value)}
              placeholder="Introduce la clave..."
              className="w-full rounded-xl pl-3.5 pr-10 py-3 text-[14px] text-white outline-none placeholder:text-[#5C5C63] tracking-wider"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }} />
            <button onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {show ? <EyeOff size={16} color={TEXT_MUTED} /> : <Eye size={16} color={TEXT_MUTED} />}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: BORDER }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${strength.pct}%`, background: strength.color }} />
              </div>
              <span className="text-[11.5px] font-medium" style={{ color: strength.color }}>{strength.label}</span>
            </div>
            <button onClick={() => setValue(genSecret())} className="flex items-center gap-1 text-[11.5px] font-medium" style={{ color: GOLD }}>
              <RefreshCw size={12} /> Generar
            </button>
          </div>
        </div>
        <div>
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Proyecto (opcional)</label>
          <div className="flex items-center justify-between rounded-xl px-3.5 py-3"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2.5">
              <Folder size={16} color={GOLD} />
              <span className="text-[13.5px] text-white">{project}</span>
            </div>
            <ChevronRight size={16} color={TEXT_FAINT} className="cursor-pointer" onClick={() => {
              const idx = FOLDERS.indexOf(project);
              setProject(FOLDERS[(idx + 1) % FOLDERS.length]);
            }} />
          </div>
        </div>
        <div>
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Notas (opcional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Añade contexto..."
            className="w-full rounded-xl px-3.5 py-3 text-[13.5px] text-white outline-none resize-none placeholder:text-[#5C5C63]"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }} />
        </div>
      </div>
      <div className="px-5 pb-4 pt-3">
        <GoldButton disabled={!name.trim() || !value.trim()} onClick={() => saveSecret({ type, name, value, project, notes })}>
          Guardar secret
        </GoldButton>
      </div>
    </div>
  );
}
