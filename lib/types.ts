export type BookStatus = 'reading' | 'completed' | 'want_to_read'

export interface Book {
  id: string
  title: string
  author: string
  cover_url: string | null
  status: BookStatus
  rating: number | null
  memo: string | null
  started_at: string | null
  finished_at: string | null
  created_at: string
}

export const STATUS_LABELS: Record<BookStatus, string> = {
  reading: '읽는 중',
  completed: '완독',
  want_to_read: '읽고 싶음',
}

export const STATUS_COLORS: Record<BookStatus, string> = {
  reading: 'bg-amber-100 text-amber-800 border-amber-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  want_to_read: 'bg-sky-100 text-sky-800 border-sky-200',
}
