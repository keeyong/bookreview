'use client'

import { useEffect, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CalendarDays, Pencil, Trash2 } from 'lucide-react'
import { use } from 'react'
import { Book, STATUS_LABELS, STATUS_COLORS } from '@/lib/types'
import { fetchBook, updateBook, deleteBook } from '@/lib/books-api'
import { RatingStars } from '@/components/rating-stars'
import { BookForm } from '@/components/book-form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchBook(id)
      .then((result) => {
        if (cancelled) return
        if (!result) setMissing(true)
        else setBook(result)
      })
      .catch(() => {
        if (!cancelled) setMissing(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (missing) notFound()

  if (loading || !book) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        불러오는 중...
      </main>
    )
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  async function handleEditSave(data: Omit<Book, 'id' | 'created_at'>) {
    const updated = await updateBook(id, data)
    setBook(updated)
  }

  async function handleDelete() {
    if (!book) return
    if (!confirm(`"${book.title}"을(를) 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return
    setDeleting(true)
    try {
      await deleteBook(id)
      router.push('/')
    } catch {
      setDeleting(false)
      alert('삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Top nav */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Cover */}
          <div className="flex-shrink-0 self-start">
            <div className="relative w-44 sm:w-52 aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-border">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={`${book.title} 표지`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 176px, 208px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground gap-2">
                  <BookOpen className="w-12 h-12 opacity-30" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <div>
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-3',
                  STATUS_COLORS[book.status]
                )}
              >
                {STATUS_LABELS[book.status]}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground leading-snug text-balance">
                {book.title}
              </h1>
              <p className="text-muted-foreground mt-1 text-base">{book.author}</p>
            </div>

            {/* Rating */}
            {book.rating ? (
              <div className="flex items-center gap-2">
                <RatingStars value={book.rating} readOnly size="lg" />
                <span className="text-sm text-muted-foreground">{book.rating}점</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">아직 별점을 남기지 않았어요</p>
            )}

            {/* Dates */}
            {(book.started_at || book.finished_at) && (
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                {book.started_at && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 flex-shrink-0" />
                    <span>시작: {formatDate(book.started_at)}</span>
                  </div>
                )}
                {book.finished_at && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 flex-shrink-0" />
                    <span>완독: {formatDate(book.finished_at)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-1.5">
                <Pencil className="w-3.5 h-3.5" />
                수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleting ? '삭제 중...' : '삭제'}
              </Button>
            </div>
          </div>
        </div>

        {/* Memo */}
        {book.memo && (
          <section className="mt-10">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-3">감상 메모</h2>
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {book.memo}
              </p>
            </div>
          </section>
        )}
      </article>

      <BookForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
        initialData={book}
      />
    </main>
  )
}
