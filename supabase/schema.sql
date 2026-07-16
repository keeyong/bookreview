-- 나의 독서 노트 — books 테이블 스키마
-- Supabase 대시보드의 SQL Editor에서 실행하세요.

create extension if not exists pgcrypto;

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  cover_url text,
  status text not null default 'want_to_read'
    check (status in ('reading', 'completed', 'want_to_read')),
  rating smallint
    check (rating is null or rating between 1 and 5),
  memo text,
  started_at date,
  finished_at date,
  created_at timestamptz not null default now()
);

create index if not exists books_status_idx on books (status);
create index if not exists books_created_at_idx on books (created_at desc);

-- Row Level Security
alter table books enable row level security;

-- 개인용 단일 사용자 앱이므로 publishable key(anon 롤)로 모든 CRUD를 허용합니다.
-- 여러 사용자를 지원하게 되면 이 정책을 auth.uid() 기준으로 좁혀야 합니다.
drop policy if exists "Allow all access to books" on books;
create policy "Allow all access to books"
  on books
  for all
  using (true)
  with check (true);
