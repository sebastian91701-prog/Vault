"use client";

import React, { useState } from "react";
import { Folder, ChevronRight } from "lucide-react";
import { useVault } from "../context/VaultContext";
import { SURFACE, BORDER, TEXT_MUTED, TEXT_FAINT, GOLD, FOLDERS } from "../../lib/constants";
import TopBar from "./TopBar";
import GoldButton from "./GoldButton";

export default function NoteEditor({ onCancel }: { onCancel: () => void }) {
  const { saveNote } = useVault();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folder, setFolder] = useState(FOLDERS[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Nueva nota" onBack={onCancel} right={
        <button onClick={onCancel} className="text-[13.5px] font-medium" style={{ color: TEXT_MUTED }}>Cancelar</button>
      } />
      <div className="px-5 flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar">
        <div>
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Escribe un título..."
            className="w-full rounded-xl px-3.5 py-3 text-[14px] text-white outline-none placeholder:text-[#5C5C63]"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }} />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Contenido</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe tu nota..." rows={7}
            className="w-full rounded-xl px-3.5 py-3 text-[13.5px] text-white outline-none resize-none placeholder:text-[#5C5C63] leading-relaxed"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }} />
          <div className="text-right text-[11px] mt-1.5" style={{ color: TEXT_FAINT }}>{content.length} caracteres</div>
        </div>
        <div>
          <label className="text-[12px] font-medium block mb-2" style={{ color: TEXT_MUTED }}>Guardar en</label>
          <div className="flex items-center justify-between rounded-xl px-3.5 py-3"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2.5">
              <Folder size={16} color={GOLD} />
              <div>
                <div className="text-[13.5px] text-white">{folder}</div>
                <div className="text-[11px]" style={{ color: TEXT_FAINT }}>Vault / {folder}</div>
              </div>
            </div>
            <ChevronRight size={16} color={TEXT_FAINT} className="cursor-pointer" onClick={() => {
              const idx = FOLDERS.indexOf(folder);
              setFolder(FOLDERS[(idx + 1) % FOLDERS.length]);
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
        <GoldButton disabled={!title.trim()} onClick={() => saveNote({ title, content, folder, tags })}>Guardar nota</GoldButton>
      </div>
    </div>
  );
}
