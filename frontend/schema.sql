-- ============================================================
-- VAULT — esquema de base de datos (Supabase / Postgres)
-- Ejecutar este archivo completo en: Supabase → SQL Editor → New query
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabla 1: items
-- Documentos, imágenes, videos, audio, notas, secrets y enlaces
-- secret_value_encrypted guarda el valor cifrado con AES-256-GCM
-- en Node (ver lib/crypto.ts), codificado en base64.
-- ------------------------------------------------------------
create table items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('document','image','video','audio','note','secret','link')),
  name text not null,
  meta text,
  date text not null,
  favorite boolean not null default false,
  folder text not null default 'General',
  size text,
  content text,
  tags text[],
  secret_type text,
  secret_value_encrypted text,
  project text,
  notes text,
  url text,
  file_path text,
  created_at timestamptz not null default now()
);

create index items_created_at_idx on items (created_at desc);
create index items_type_idx on items (type);

-- ------------------------------------------------------------
-- Tabla 2: activity
-- Historial de acciones del Vault
-- ------------------------------------------------------------
create table activity (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  item_name text not null,
  icon_key text not null,
  created_at timestamptz not null default now()
);

create index activity_created_at_idx on activity (created_at desc);

-- ------------------------------------------------------------
-- Storage: bucket privado para los archivos reales
-- (documentos, imágenes, videos, audio)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('vault-files', 'vault-files', false)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- RLS (Row Level Security)
-- Nota: esta demo no tiene login todavía, así que se habilita
-- acceso solo a través del backend (rutas /api/*), que usa la
-- service_role key. Si más adelante agregamos autenticación de
-- usuarios, aquí se reemplazan estas políticas por unas que
-- filtren por auth.uid().
-- ------------------------------------------------------------
alter table items enable row level security;
alter table activity enable row level security;

-- El backend (service_role) siempre puede pasar por RLS,
-- así que no se necesitan policies adicionales mientras todo
-- el acceso pase por las rutas /api/*.
