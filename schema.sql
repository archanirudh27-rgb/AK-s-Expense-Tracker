create extension if not exists pgcrypto;
create table if not exists public.expenses(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,date date not null,category text not null,subcategory text not null,description text,amount numeric(12,2) not null check(amount>0),payment_mode text,notes text,created_at timestamptz default now());
alter table public.expenses enable row level security;
create policy "own select" on public.expenses for select using(auth.uid()=user_id);
create policy "own insert" on public.expenses for insert with check(auth.uid()=user_id);
create policy "own update" on public.expenses for update using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "own delete" on public.expenses for delete using(auth.uid()=user_id);
