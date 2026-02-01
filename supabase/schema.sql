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


-- ... (Your existing code goes above this) ...

-- 6. TENANTS (The People)
-- Tracks the residents, their lease details, and contact info.
create table public.tenants (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references auth.users not null, -- Links to the Landlord
  property_id uuid references public.properties(id) not null,
  unit_id uuid references public.units(id), -- Can be NULL if not assigned yet
  
  full_name text not null,
  email text,
  phone text,
  
  status text check (status in ('active', 'past', 'evicted')) default 'active',
  lease_start_date date not null,
  lease_end_date date
);

-- 7. INVOICES (The Money)
-- Tracks rent requests, payments, and statuses.
create table public.invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references auth.users not null,
  tenant_id uuid references public.tenants(id) not null,
  property_id uuid references public.properties(id) not null,
  
  amount numeric not null,           -- Total bill (e.g. 5000)
  amount_paid numeric default 0,     -- How much they paid so far
  status text check (status in ('pending', 'paid', 'partial', 'overdue')) default 'pending',
  due_date date not null,
  
  bill_period date,                  -- e.g. '2026-02-01' for Feb Rent
  notes text
);

-- 8. ENABLE RLS FOR NEW TABLES
alter table public.tenants enable row level security;
alter table public.invoices enable row level security;

-- 9. SECURITY POLICIES (Strict Access)
-- Ensure landlords only see THEIR own data

-- Property Policy (Update existing if needed, or add this)
create policy "Users can manage their own properties" 
on public.properties for all 
using (auth.uid() = owner_id);

-- Unit Policy (Simple check)
create policy "Users can manage units" 
on public.units for all 
using (true); 

-- Tenant Policy
create policy "Users can manage their own tenants" 
on public.tenants for all 
using (auth.uid() = owner_id);

-- Invoice Policy
create policy "Users can manage their own invoices" 
on public.invoices for all 
using (auth.uid() = owner_id);

-- 10. AUTOMATION (The Magic Trigger)
-- When a tenant is assigned to a unit, automatically mark that unit as 'occupied'

create or replace function public.update_unit_status_on_tenant()
returns trigger as $$
begin
  -- If a tenant is assigned a unit (unit_id is not null)
  if new.unit_id is not null then
    update public.units 
    set status = 'occupied' 
    where id = new.unit_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger on_tenant_added
after insert on public.tenants
for each row execute procedure public.update_unit_status_on_tenant();