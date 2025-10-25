-- Create organizations table
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text,
  city text,
  country text,
  postal_code text,
  phone text,
  email text,
  website text,
  tax_id text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.organizations enable row level security;

-- RLS Policies for organizations
create policy "Users can view their own organizations"
  on public.organizations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own organizations"
  on public.organizations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own organizations"
  on public.organizations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own organizations"
  on public.organizations for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists organizations_user_id_idx on public.organizations(user_id);
