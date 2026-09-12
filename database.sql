-- نموذج PostgreSQL للإنتاج: لا ننشئ جدولًا جديدًا لكل شهر أو سنة.
create type account_role as enum ('owner', 'guard');
create type account_status as enum ('pending', 'active', 'suspended');
create type payment_state as enum ('unpaid', 'partial', 'paid');
create type order_state as enum ('new', 'shopping', 'delivered', 'cancelled');

create table accounts (
  id uuid primary key,
  full_name text not null,
  phone text,
  role account_role not null default 'guard',
  status account_status not null default 'pending',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create table buildings (
  id uuid primary key,
  guard_id uuid references accounts(id),
  name text not null,
  address text,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table units (
  id uuid primary key,
  building_id uuid not null references buildings(id),
  unit_number text not null,
  floor_number text,
  monthly_fee numeric(12,2) not null default 0,
  unique (building_id, unit_number)
);

create table residents (
  id uuid primary key,
  unit_id uuid not null references units(id),
  resident_name text not null,
  resident_phone text,
  owner_name text,
  owner_phone text,
  starts_on date not null default current_date,
  ends_on date,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table monthly_dues (
  id uuid primary key,
  building_id uuid not null references buildings(id),
  unit_id uuid not null references units(id),
  resident_id uuid not null references residents(id),
  due_year smallint not null,
  due_month smallint not null check (due_month between 1 and 12),
  amount_due numeric(12,2) not null,
  amount_paid numeric(12,2) not null default 0,
  state payment_state not null default 'unpaid',
  unique (unit_id, due_year, due_month)
);

create table payments (
  id uuid primary key,
  monthly_due_id uuid not null references monthly_dues(id),
  amount numeric(12,2) not null check (amount > 0),
  paid_at timestamptz not null default now(),
  note text
);

create table vehicles (
  id uuid primary key,
  resident_id uuid not null references residents(id),
  plate_number text not null,
  make_model text,
  color text,
  parking_number text
);

create table shopping_orders (
  id uuid primary key,
  resident_id uuid not null references residents(id),
  category text not null,
  state order_state not null default 'new',
  goods_total numeric(12,2) not null default 0,
  service_fee numeric(12,2) not null default 0,
  note text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);

create table building_expenses (
  id uuid primary key,
  building_id uuid not null references buildings(id),
  category text not null check (category in ('elevator', 'repair', 'other')),
  amount numeric(12,2) not null check (amount > 0),
  note text,
  incurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table audit_log (
  id uuid primary key,
  actor_id uuid not null references accounts(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

-- عند فتح شهر جديد، تنشئ الخدمة monthly_dues من الوحدات النشطة.
-- لذلك يعمل الانتقال من ديسمبر إلى يناير ومن سنة إلى أخرى تلقائيًا
-- دون إنشاء جداول قاعدة بيانات جديدة ودون تغيير السجلات التاريخية.
