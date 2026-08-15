"use client";

import React, { useRef, useState } from "react";
import { X, UploadCloud, Video, Lock, Folder, ChevronRight } from "lucide-react";
import type { ItemType } from "../../lib/types";
import { useVault } from "../../context/VaultContext";
import { SURFACE, SURFACE_2, BORDER, TEXT_MUTED, TEXT_FAINT, GOLD, GOLD_SOFT, FOLDERS, MEDIA_CONFIG, DOC_FORMATS, TYPE_META } from "../../lib/constants";
import { formatBytes, formatDuration } from "../../lib/utils";
import TopBar from "../TopBar";
import IconBadge from "../IconBadge";

export default function MediaEditor({ type, onCancel }: { type: "image" | "video" | "document"; onCancel: () => void }) {
  const { saveMedia } = useVault();
  const cfg = MEDIA_CONFIG[type];
  const Icon = cfg.icon;
  const meta = (TYPE_META as any)[type];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [name, setName] = useState("");
  const [project, setProject] = useState(FOLDERS[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const pickFile = (f: File | null | undefined) => {
    if (!f) return;
    setFile(f);
    setName(f.name);
    setDuration(null);
    if (type === "image" || type === "video") {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setName("");
    setDuration(null);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files && e.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col h-full">
      <input ref={fileInputRef} type="file" accept={cfg.accept} className="hidden"
        onChange={(e) => { pickFile(e.target.files && e.target.files[0]); e.target.value = ""; }} />
      <TopBar title={cfg.title} onBack={onCancel} right={
        <button onClick={onCancel} className="text-[13.5px] font-medium" style={{ color: TEXT_MUTED }}>Cancelar</button>
      } />
      <div className="px-5 flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar">
        {!file && (
          <div
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-3 border border-dashed cursor-pointer transition-colors"
            style={{ borderColor: dragOver ? GOLD : BORDER, background: dragOver ? GOLD_SOFT : SURFACE }}>
            <div className="w-11 h-11 rounded-[11px] flex items-center justify-center" style={{ background: meta.bg }}>
              <Icon size={20} color={meta.color} />
            </div>
            <div className="text-center">
              <div className="text-[13.5px] font-medium text-white">{cfg.select}</div>
              <div className="text-[11.5px] mt-0.5" style={{ color: TEXT_MUTED }}>o arrastra y suelta tu archivo aquí</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); fileInputRef.current && fileInputRef.current.click(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12.5px] font-medium mt-1"
              style={{ border: `1px solid ${GOLD}`, color: GOLD }}>
              <UploadCloud size={14} /> Seleccionar desde dispositivo
            </button>
          </div>
        )}

        {type === "document" && (
          <div>
            <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Formato soportado</label>
            <div className="flex flex-wrap gap-2">
              {DOC_FORMATS.map((f) => (
                <span key={f} className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT_MUTED }}>{f}</span>
              ))}
            </div>
          </div>
        )}

        {file && (
          <div>
            <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Vista previa</label>
            {type === "image" && previewUrl && (
              <div className="relative rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt={name} className="w-full h-48 object-cover" />
                <button onClick={clearFile} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}><X size={14} color="white" /></button>
              </div>
            )}
            {type === "video" && previewUrl && (
              <div className="relative rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <video src={previewUrl} className="w-full h-48 object-cover bg-black"
                  onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)} muted />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <Video size={18} color="white" />
                  </div>
                </div>
                {formatDuration(duration) && (
                  <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded text-[10.5px] text-white" style={{ background: "rgba(0,0,0,0.65)" }}>
                    {formatDuration(duration)}
                  </span>
                )}
                <button onClick={clearFile} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}><X size={14} color="white" /></button>
              </div>
            )}
            {type === "document" && (
              <div className="relative flex items-center gap-3 rounded-xl px-3.5 py-3" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <IconBadge type="document" size={40} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white truncate">{file.name}</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: TEXT_MUTED }}>{formatBytes(file.size)}</div>
                </div>
                <button onClick={clearFile} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: SURFACE_2 }}>
                  <X size={13} color={TEXT_MUTED} />
                </button>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Nombre (opcional)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del archivo"
            className="w-full rounded-xl px-3.5 py-3 text-[14px] text-white outline-none placeholder:text-[#5C5C63]"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }} />
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
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Etiquetas (opcional)</label>
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map((t) => (
              <span key={t} onClick={() => setTags(tags.filter((x) => x !== t))}
                className="px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer"
                style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "white" }}>{t} ✕</span>
            ))}
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              placeholder="+"
              className="w-16 px-3 py-1.5 rounded-full text-[12px] outline-none placeholder:text-[#5C5C63] text-white"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }} />
          </div>
        </div>
      </div>
      <div className="px-5 pb-4 pt-3">
        <button disabled={!file} onClick={() => file && saveMedia(type as ItemType, { file, name, project, tags })}
          className="w-full py-3.5 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ background: file ? GOLD : "#3a3a3a", color: "#161208" }}>
          <Lock size={15} /> {cfg.saveLabel}
        </button>
      </div>
    </div>
  );
}
