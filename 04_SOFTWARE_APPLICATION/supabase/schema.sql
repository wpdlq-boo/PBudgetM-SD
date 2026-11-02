-- WAIS Personal Budget Manager
-- Paste this entire file into the Supabase SQL Editor and click Run.
-- Then: Authentication → Providers → Google → Enable
-- Site URL + Redirect URLs: your Vercel URL (and http://localhost:5173 for local)

create table if not exists public.keepalive (
  id int primary key default 1,
  pinged_at timestamptz not null default now()
);
insert into public.keepalive (id) values (1) on conflict (id) do nothing;
alter table public.keepalive enable row level security;
drop policy if exists keepalive_select on public.keepalive;
drop policy if exists keepalive_update on public.keepalive;
create policy keepalive_select on public.keepalive for select using (true);
create policy keepalive_update on public.keepalive for update using (true) with check (true);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  monthly_budget numeric not null default 1000,
  daily_allowance numeric not null default 50,
  streak int not null default 1,
  last_log_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  name text not null,
  emoji text not null,
  color text not null,
  monthly_limit numeric,
  is_fixed boolean not null default false,
  sort_order int not null default 0,
  unique (user_id, slug)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id),
  amount numeric not null check (amount > 0),
  occurred_on date not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

drop policy if exists profiles_own on public.profiles;
drop policy if exists settings_own on public.settings;
drop policy if exists categories_own on public.categories;
drop policy if exists transactions_own on public.transactions;
create policy profiles_own on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy settings_own on public.settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy categories_own on public.categories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy transactions_own on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  food_id uuid;
  transit_id uuid;
  today date := (timezone('Asia/Manila', now()))::date;
  yesterday date := (timezone('Asia/Manila', now()))::date - 1;
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Friend'));

  insert into public.settings (user_id, monthly_budget, daily_allowance, streak, last_log_date)
  values (new.id, 1000, 50, 1, today);

  insert into public.categories (user_id, slug, name, emoji, color, monthly_limit, is_fixed, sort_order)
  values
    (new.id, 'food', 'Food & Dining', '🍔', '#3B63E5', 300, false, 1),
    (new.id, 'shopping', 'Shopping', '🛍️', '#C2409B', 100, false, 2),
    (new.id, 'grocery', 'Grocery', '🛒', '#38A0F0', 150, false, 3),
    (new.id, 'transport', 'Transit', '🚗', '#64748B', 200, false, 4),
    (new.id, 'ent', 'Entertainment', '🎬', '#7C5CD6', 100, false, 5),
    (new.id, 'utility', 'Utilities', '⚡', '#D98E04', null, true, 6),
    (new.id, 'subs', 'Subscriptions', '📺', '#0E8FA0', null, true, 7),
    (new.id, 'rent', 'Rent', '🏠', '#0F2A52', null, true, 8),
    (new.id, 'savings', 'Savings', '🐷', '#1F7A4D', null, true, 9);

  select id into food_id from public.categories where user_id = new.id and slug = 'food';
  select id into transit_id from public.categories where user_id = new.id and slug = 'transport';

  insert into public.transactions (user_id, category_id, amount, occurred_on, note)
  values
    (new.id, food_id, 80, yesterday, 'Jollibee Dinner'),
    (new.id, transit_id, 45, today, 'Jeep fare');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
