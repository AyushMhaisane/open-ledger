-- 1. PROFILES (Extends Supabase Auth)
-- This table automatically links to the auth.users table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role text check (role in ('admin', 'owner', 'tenant')) default 'owner',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PROPERTIES (The Building / Complex)
-- Represents a Hostel, Apartment Complex, or Office Building
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) not null,
  name text not null,
  type text check (type in ('apartment', 'hostel', 'commercial', 'mixed')) not null,
  address text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. UNITS (The Rentable Space)
-- This is where the magic happens. 
-- 'metadata' stores specific fields like 'bed_type' or 'square_footage'
create table public.units (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  name text not null, -- e.g., "Room 101" or "Bed A"
  status text check (status in ('vacant', 'occupied', 'maintenance')) default 'vacant',
  monthly_rent numeric(10, 2) not null,
  
  -- The Domain-Agnostic Secret Weapon
  metadata jsonb default '{}'::jsonb, 
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
-- Crucial: This ensures users can't delete each other's data
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.units enable row level security;

-- 5. Create Simple Policies (We will refine these later)
-- Allow users to see their own profile
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );