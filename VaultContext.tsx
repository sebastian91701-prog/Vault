"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { VaultItem, ActivityEntry, Screen, Flow, SuccessInfo, ItemType } from "../lib/types";
import { STAT_BASE, FOLDERS, CATEGORY_LABEL, ADDED_LABEL } from "../lib/constants";
import { nowStamp } from "../lib/utils";
import {
  apiListItems, apiCreateItem, apiUpdateItem, apiDeleteItem,
  apiListActivity, apiLogActivity, apiUploadFile,
} from "../lib/api-client";

interface VaultContextValue {
  items: VaultItem[];
  activity: ActivityEntry[];
  loading: boolean;
  screen: Screen;
  setScreen: (s: Screen) => void;
  flow: Flow;
  setFlow: (f: Flow) => void;
  selectedItem: VaultItem | null;
  setSelectedItem: (i: VaultItem | null) => void;
  menuItem: VaultItem | null;
  setMenuItem: (i: VaultItem | null) => void;
  renamingItem: VaultItem | null;
  setRenamingItem: (i: VaultItem | null) => void;
  homeSearch: string;
  setHomeSearch: (s: string) => void;
  vaultSearch: string;
  setVaultSearch: (s: string) => void;
  filter: string;
  setFilter: (s: string) => void;
  success: SuccessInfo | null;
  setSuccess: (s: SuccessInfo | null) => void;
  toast: string | null;
  stats: Record<string, number>;
  showToast: (text: string) => void;
  handleAddPick: (key: string) => void;
  handleFilePicked: (type: ItemType, file: File) => Promise<void>;
  saveMedia: (type: ItemType, data: { file: File; name: string; project: string; tags: string[] }) => Promise<void>;
  saveNote: (data: { title: string; content: string; folder: string; tags: string[] }) => Promise<void>;
  saveSecret: (data: { type: string; name: string; value: string; project: string; notes: string }) => Promise<void>;
  toggleFav: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  startRename: (item: VaultItem) => void;
  saveRename: (newName: string) => Promise<void>;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>("home");
  const [flow, setFlow] = useState<Flow>(null);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [menuItem, setMenuItem] = useState<VaultItem | null>(null);
  const [renamingItem, setRenamingItem] = useState<VaultItem | null>(null);
  const [homeSearch, setHomeSearch] = useState("");
  const [vaultSearch, setVaultSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [success, setSuccess] = useState<SuccessInfo | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Carga inicial desde la base de datos
  useEffect(() => {
    (async () => {
      try {
        const [dbItems, dbActivity] = await Promise.all([apiListItems(), apiListActivity()]);
        setItems(dbItems);
        setActivity(dbActivity);
      } catch (e) {
        console.error("Error cargando Vault:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const s = { ...STAT_BASE } as Record<string, number>;
    items.forEach((it) => {
      if (s[it.type] !== undefined) s[it.type] += 1;
    });
    return s;
  }, [items]);

  const showToast = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 2200);
  };

  const pushActivity = async (iconKey: string, action: string, itemName: string) => {
    // Optimista: la mostramos ya mismo, y confirmamos con el servidor en paralelo.
    const optimistic: ActivityEntry = {
      id: `tmp-${Date.now()}`, icon_key: iconKey, action, item_name: itemName,
      created_at: new Date().toISOString(),
    };
    setActivity((prev) => [optimistic, ...prev]);
    try {
      const entry = await apiLogActivity(action, itemName, iconKey);
      setActivity((prev) => [entry as any, ...prev.filter((a) => a.id !== optimistic.id)]);
    } catch (e) {
      console.error("Error registrando actividad:", e);
    }
  };

  const handleAddPick = (key: string) => {
    if (key === "note") { setFlow("note"); return; }
    if (key === "secret") { setFlow("secret"); return; }
    if (key === "image" || key === "video" || key === "document") { setFlow(key as Flow); return; }
    if (key === "link") {
      setFlow(null);
      showToast("Función de enlaces próximamente");
      return;
    }
  };

  const handleFilePicked = async (type: ItemType, file: File) => {
    try {
      const { filePath, size } = await apiUploadFile(file);
      const category = CATEGORY_LABEL[type] || "Documentos";
      const item = await apiCreateItem({
        type, name: file.name, meta: `${category} · ${FOLDERS[0]}`,
        date: `Hoy, ${nowStamp()}`, folder: FOLDERS[0], size: formatSize(size), filePath,
      });
      setItems((prev) => [item, ...prev]);
      pushActivity(type, ADDED_LABEL[type], file.name);
      setFlow(null);
      setSuccess({ kind: type, title: file.name });
    } catch (e: any) {
      showToast(e.message || "No se pudo subir el archivo.");
    }
  };

  const saveMedia = async (type: ItemType, { file, name, project, tags }: { file: File; name: string; project: string; tags: string[] }) => {
    try {
      const { filePath, size } = await apiUploadFile(file);
      const category = CATEGORY_LABEL[type] || "Documentos";
      const finalName = (name && name.trim()) || file.name;
      const item = await apiCreateItem({
        type, name: finalName, meta: `${category} · ${project}`,
        date: `Hoy, ${nowStamp()}`, folder: project, size: formatSize(size), filePath, tags,
      });
      setItems((prev) => [item, ...prev]);
      pushActivity(type, ADDED_LABEL[type], finalName);
      setFlow(null);
      setSuccess({ kind: type, title: finalName });
    } catch (e: any) {
      showToast(e.message || "No se pudo guardar el archivo.");
    }
  };

  const saveNote = async ({ title, content, folder, tags }: { title: string; content: string; folder: string; tags: string[] }) => {
    try {
      const item = await apiCreateItem({
        type: "note", name: title, meta: `Notas · ${folder}`,
        date: `Hoy, ${nowStamp()}`, folder, content, tags,
      });
      setItems((prev) => [item, ...prev]);
      pushActivity("note", "Nota creada", title);
      setFlow(null);
      setSuccess({ kind: "note", title, folder });
    } catch (e: any) {
      showToast(e.message || "No se pudo guardar la nota.");
    }
  };

  const saveSecret = async ({ type, name, value, project, notes }: { type: string; name: string; value: string; project: string; notes: string }) => {
    try {
      const item = await apiCreateItem({
        type: "secret", name, meta: `Secrets · ${type}`,
        date: `Hoy, ${nowStamp()}`, folder: project, secretType: type, value, project, notes,
      });
      setItems((prev) => [item, ...prev]);
      pushActivity("secret", "Secret guardado", name);
      setFlow(null);
      setSuccess({ kind: "secret", title: name });
    } catch (e: any) {
      showToast(e.message || "No se pudo guardar el secret.");
    }
  };

  const toggleFav = async (id: string) => {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const next = !it.favorite;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, favorite: next } : i)));
    setSelectedItem((si) => (si && si.id === id ? { ...si, favorite: next } : si));
    try {
      await apiUpdateItem(id, { favorite: next });
      pushActivity("star", next ? "Marcado como favorito" : "Quitado de favoritos", it.name);
    } catch (e: any) {
      showToast(e.message || "No se pudo actualizar el favorito.");
    }
  };

  const deleteItem = async (id: string) => {
    const it = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItem(null);
    setMenuItem(null);
    try {
      await apiDeleteItem(id);
      if (it) pushActivity("trash", "Elemento eliminado", it.name);
      showToast("Elemento eliminado");
    } catch (e: any) {
      showToast(e.message || "No se pudo eliminar el elemento.");
    }
  };

  const startRename = (item: VaultItem) => {
    setMenuItem(null);
    setRenamingItem(item);
  };

  const saveRename = async (newName: string) => {
    if (!renamingItem) return;
    const id = renamingItem.id;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, name: newName } : it)));
    setSelectedItem((si) => (si && si.id === id ? { ...si, name: newName } : si));
    setRenamingItem(null);
    try {
      await apiUpdateItem(id, { name: newName });
      pushActivity("pencil", "Elemento renombrado", newName);
      showToast("Elemento renombrado");
    } catch (e: any) {
      showToast(e.message || "No se pudo renombrar el elemento.");
    }
  };

  const value: VaultContextValue = {
    items, activity, loading, screen, setScreen, flow, setFlow, selectedItem, setSelectedItem,
    menuItem, setMenuItem, renamingItem, setRenamingItem, homeSearch, setHomeSearch,
    vaultSearch, setVaultSearch, filter, setFilter, success, setSuccess, toast, stats,
    showToast, handleAddPick, handleFilePicked, saveMedia, saveNote, saveSecret,
    toggleFav, deleteItem, startRename, saveRename,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

function formatSize(bytes: number): string {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault debe usarse dentro de <VaultProvider>");
  return ctx;
}
