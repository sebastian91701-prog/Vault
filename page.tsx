"use client";

import React from "react";
import { VaultProvider, useVault } from "../context/VaultContext";
import { BG, BORDER, ADDED_LABEL } from "../lib/constants";
import NavShell from "../components/NavShell";
import { Toast } from "../components/EmptyState";
import HomeScreen from "../components/screens/HomeScreen";
import VaultScreen from "../components/screens/VaultScreen";
import ActivityScreen from "../components/screens/ActivityScreen";
import ProfileScreen from "../components/screens/ProfileScreen";
import AddModal from "../components/modals/AddModal";
import NoteEditor from "../components/modals/NoteEditor";
import SecretEditor from "../components/modals/SecretEditor";
import MediaEditor from "../components/modals/MediaEditor";
import ItemDetail from "../components/modals/ItemDetail";
import ItemMenuSheet from "../components/modals/ItemMenuSheet";
import RenameModal from "../components/modals/RenameModal";
import SuccessOverlay from "../components/modals/SuccessOverlay";

function VaultApp() {
  const {
    screen, setScreen, flow, setFlow, selectedItem, setSelectedItem,
    menuItem, setMenuItem, renamingItem, setRenamingItem, success, setSuccess,
    toast, toggleFav, deleteItem, startRename, saveRename, loading,
  } = useVault();

  let body: React.ReactNode = null;
  if (loading) {
    body = (
      <div className="flex flex-col items-center justify-center h-full py-24">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#D9A441", borderTopColor: "transparent" }} />
      </div>
    );
  } else if (screen === "home") body = <HomeScreen />;
  else if (screen === "vault") body = <VaultScreen />;
  else if (screen === "activity") body = <ActivityScreen />;
  else if (screen === "profile") body = <ProfileScreen />;

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ background: "#000" }}>
      <div className="w-full h-full lg:max-w-5xl lg:h-[92vh] lg:rounded-3xl overflow-hidden lg:border relative"
        style={{ background: BG, borderColor: BORDER }}>
        <NavShell active={screen} onNav={setScreen} onAdd={() => setFlow("add")}>
          {body}
        </NavShell>

        {flow === "add" && <AddModal onClose={() => setFlow(null)} />}
        {flow === "note" && (
          <div className="fixed inset-0 z-50" style={{ background: BG }}>
            <NoteEditor onCancel={() => setFlow(null)} />
          </div>
        )}
        {flow === "secret" && (
          <div className="fixed inset-0 z-50" style={{ background: BG }}>
            <SecretEditor onCancel={() => setFlow(null)} />
          </div>
        )}
        {(flow === "image" || flow === "video" || flow === "document") && (
          <div className="fixed inset-0 z-50" style={{ background: BG }}>
            <MediaEditor type={flow} onCancel={() => setFlow(null)} />
          </div>
        )}
        {selectedItem && (
          <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} onToggleFav={toggleFav} onDelete={deleteItem} />
        )}
        {menuItem && (
          <ItemMenuSheet item={menuItem} onClose={() => setMenuItem(null)} onRename={startRename} onDelete={deleteItem} />
        )}
        {renamingItem && (
          <RenameModal item={renamingItem} onCancel={() => setRenamingItem(null)} onSave={saveRename} />
        )}
        {success && (
          <SuccessOverlay
            title={
              success.kind === "note" ? "Nota guardada"
              : success.kind === "secret" ? "Secret guardado"
              : ADDED_LABEL[success.kind]
            }
            message={
              success.kind === "note" ? `"${success.title}" se ha guardado correctamente en Vault / ${success.folder}.`
              : success.kind === "secret" ? `"${success.title}" se ha guardado de forma segura en Vault.`
              : `"${success.title}" se ha guardado correctamente en Vault.`
            }
            onOk={() => setSuccess(null)}
          />
        )}
        {toast && <Toast text={toast} />}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <VaultProvider>
      <VaultApp />
    </VaultProvider>
  );
}
