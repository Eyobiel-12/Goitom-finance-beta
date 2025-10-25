-- Create settings table
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  currency text not null default 'ETB',
  tax_rate numeric(5, 2) not null default 15.00,
  invoice_prefix text default 'INV',
  invoice_terms text,
  invoice_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.settings enable row level security;

-- RLS Policies for settings
create policy "Users can view their own settings"
  on public.settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.settings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own settings"
  on public.settings for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists settings_user_id_idx on public.settings(user_id);
