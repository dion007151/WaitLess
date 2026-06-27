// Supabase client stub
// Replace NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// in your .env.local file to enable real backend connectivity.
//
// .env.local example:
//   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const IS_DEMO_MODE = !supabaseUrl || !supabaseAnonKey;

// Lazy-loaded Supabase client — only created when credentials exist
let _supabase: ReturnType<typeof import('@supabase/supabase-js').createClient> | null = null;

export async function getSupabaseClient() {
  if (IS_DEMO_MODE) return null;
  if (_supabase) return _supabase;
  const { createClient } = await import('@supabase/supabase-js');
  _supabase = createClient(supabaseUrl!, supabaseAnonKey!);
  return _supabase;
}

// SQL schema for reference — run in Supabase SQL editor
export const SCHEMA_SQL = `
-- businesses
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  owner_id uuid references auth.users(id),
  subscription_plan text default 'free',
  settings_json jsonb default '{}'
);

-- queues (one per business per day)
create table queues (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id),
  date date not null,
  prefix text default 'A',
  current_number int default 0,
  status text default 'active'
);

-- queue_entries
create table queue_entries (
  id uuid primary key default gen_random_uuid(),
  queue_id uuid references queues(id),
  number int not null,
  display_number text not null,
  phone text,
  status text default 'waiting',
  joined_at timestamptz default now(),
  called_at timestamptz,
  served_at timestamptz,
  counter_number int
);

-- staff
create table staff (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id),
  name text not null,
  email text unique not null,
  counter_number int default 1,
  role text default 'staff'
);

-- Row Level Security
alter table businesses enable row level security;
alter table queues enable row level security;
alter table queue_entries enable row level security;
alter table staff enable row level security;

-- Realtime
alter publication supabase_realtime add table queue_entries;
alter publication supabase_realtime add table queues;
`;
