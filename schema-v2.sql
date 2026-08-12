-- Run this ONCE in Supabase SQL Editor before using Budget / Forecast / Recurring overrides.
-- Existing expenses are preserved.

create table if not exists public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  budget numeric(12,2) not null default 50000,
  cat_budgets jsonb not null default '{}'::jsonb,
  overrides jsonb not null default '{}'::jsonb,
  upcoming jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

drop policy if exists "users can view own settings" on public.settings;
create policy "users can view own settings" on public.settings for select using (auth.uid() = user_id);

drop policy if exists "users can insert own settings" on public.settings;
create policy "users can insert own settings" on public.settings for insert with check (auth.uid() = user_id);

drop policy if exists "users can update own settings" on public.settings;
create policy "users can update own settings" on public.settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Optional: automatically create settings for future accounts.
create or replace function public.handle_new_user_settings()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.settings(user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_settings on auth.users;
create trigger on_auth_user_created_settings after insert on auth.users
for each row execute procedure public.handle_new_user_settings();
