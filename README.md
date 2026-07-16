# 나의 독서 노트

읽은 책, 읽는 중인 책, 읽고 싶은 책을 기록하고 별점과 감상 메모를 남기는 개인 독서 기록 앱입니다.

## 기술 스택

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/), shadcn 스타일 UI 컴포넌트
- [Supabase](https://supabase.com/) (Postgres) — 데이터 저장/조회

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. Supabase 프로젝트 준비

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. 대시보드 **SQL Editor**에서 [`supabase/schema.sql`](./supabase/schema.sql) 실행 (테이블 + RLS 정책 생성)
3. (선택) 예시 데이터를 원하면 [`supabase/seed.sql`](./supabase/seed.sql)도 실행
4. **Project Settings → API**에서 `Project URL`과 `Publishable key` 확인

### 3. 환경변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local`에 Supabase 프로젝트 값 입력:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

## 주요 기능

- 책 등록/수정/삭제, 상태별(읽는 중 / 완독 / 읽고 싶음) 필터링
- 제목·저자 검색
- 5점 만점 별점, 감상 메모
- 책 상세 페이지

## 프로젝트 구조

```
app/               # Next.js App Router 페이지
components/        # UI 컴포넌트
lib/               # 타입, Supabase 클라이언트, API 함수
supabase/          # DB 스키마 및 시드 SQL
```
