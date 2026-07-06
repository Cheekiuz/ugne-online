-- Run once in Supabase SQL Editor (after creating sponsor_smiles table)

alter table sponsor_smiles
  add column if not exists pos_x real,
  add column if not exists pos_y real;

create unique index if not exists sponsor_smiles_visitor_id_key
  on sponsor_smiles (visitor_id);
