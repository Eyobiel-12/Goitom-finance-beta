-- Create vat_reports table
create table if not exists public.vat_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  total_sales numeric(12, 2) not null default 0,
  total_vat numeric(12, 2) not null default 0,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'approved')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.vat_reports enable row level security;

-- RLS Policies for vat_reports
create policy "Users can view their own vat reports"
  on public.vat_reports for select
  using (auth.uid() = user_id);

create policy "Users can insert their own vat reports"
  on public.vat_reports for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own vat reports"
  on public.vat_reports for update
  using (auth.uid() = user_id);

create policy "Users can delete their own vat reports"
  on public.vat_reports for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists vat_reports_user_id_idx on public.vat_reports(user_id);
create index if not exists vat_reports_period_idx on public.vat_reports(period_start, period_end);
