"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";
import type { ItemType } from "../lib/types";
import { useVault } from "../context/VaultContext";
import { BORDER, GOLD, GOLD_SOFT, TEXT_FAINT, TYPE_META, ADD_OPTIONS } from "../../lib/constants";

export default function AddModal({ onClose }: { onClose: () => void }) {
  const { handleAddPick, handleFilePicked } = useVault();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropInputRef = useRef<HTMLInputElement>(null);
  const pendingTypeRef = useRef<ItemType | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (sheetRef.current) sheetRef.current.scrollTop = 0;
  }, []);

  const ACCEPT: Record<string, string> = { audio: "audio/*" };

  const inferType = (file: File): ItemType => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "document";
  };

  const handlePick = (key: string) => {
    if (ACCEPT[key]) {
      pendingTypeRef.current = key as ItemType;
      if (fileInputRef.current) {
        fileInputRef.current.accept = ACCEPT[key];
        fileInputRef.current.click();
      }
    } else {
      handleAddPick(key);
    }
  };

  const handleTypedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && pendingTypeRef.current) handleFilePicked(pendingTypeRef.current, file);
    e.target.value = "";
    pendingTypeRef.current = null;
  };

  const handleDropzoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleFilePicked(inferType(file), file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFilePicked(inferType(file), file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div ref={sheetRef} className="relative w-full lg:max-w-md lg:rounded-2xl rounded-t-2xl animate-sheet sheet-88 overflow-y-auto no-scrollbar"
        style={{ background: "#111113", border: `1px solid ${BORDER}`, borderBottom: "none" }}>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleTypedFileChange} />
        <input ref={dropInputRef} type="file" className="hidden" onChange={handleDropzoneChange} />
        <div className="flex justify-center pt-2.5 lg:hidden">
          <div className="w-9 h-1 rounded-full" style={{ background: BORDER }} />
        </div>
        <div className="flex items-center justify-between px-5 pt-3 pb-1 sticky top-0 z-10" style={{ background: "#111113" }}>
          <button onClick={onClose} className="p-1 text-white/70"><X size={20} /></button>
          <h2 className="text-[16px] font-semibold text-white">Añadir a Vault</h2>
          <div className="w-6" />
        </div>
        <div className="grid grid-cols-3 gap-2.5 px-5 pt-4">
          {ADD_OPTIONS.map((o) => {
            const meta = (TYPE_META as any)[o.key];
            const Icon = meta.icon;
            return (
              <button key={o.key} onClick={() => handlePick(o.key)}
                className="flex flex-col items-center gap-2 py-4 rounded-xl transition-transform active:scale-95"
                style={{ background: "#141416", border: `1px solid ${BORDER}` }}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: meta.bg }}>
                  <Icon size={19} color={meta.color} />
                </div>
                <div className="text-center px-1">
                  <div className="text-[12.5px] font-medium text-white">{o.label}</div>
                  <div className="text-[9.5px] leading-tight mt-0.5" style={{ color: TEXT_FAINT }}>{o.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div
          onClick={() => dropInputRef.current && dropInputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="mx-5 mt-4 mb-6 rounded-xl py-6 flex flex-col items-center gap-2 border border-dashed cursor-pointer transition-colors"
          style={{ borderColor: dragOver ? GOLD : BORDER, background: dragOver ? GOLD_SOFT : "transparent" }}>
          <UploadCloud size={20} color={dragOver ? GOLD : TEXT_FAINT} />
          <div className="text-center">
            <div className="text-[12.5px] text-white/80">Arrastra y suelta tus archivos aquí</div>
            <div className="text-[11px]" style={{ color: TEXT_FAINT }}>o haz clic para seleccionar desde tu teléfono</div>
          </div>
        </div>
      </div>
    </div>
  );
}
