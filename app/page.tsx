'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, BookOpenCheck } from 'lucide-react'
import { fetchBooks, createBook, updateBook } from '@/lib/books-api'
import { Book, BookStatus } from '@/lib/types'
import { BookCard } from '@/components/book-card'
import { StatusFilter } from '@/components/status-filter'
import { BookForm } from '@/components/book-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FilterValue = BookStatus | 'all'

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterValue>('all')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch((err) => setLoadError(err instanceof Error ? err.message : '책 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const counts = useMemo(() => {
    return {
      all: books.length,
      reading: books.filter((b) => b.status === 'reading').length,
      completed: books.filter((b) => b.status === 'completed').length,
      want_to_read: books.filter((b) => b.status === 'want_to_read').length,
    }
  }, [books])

  const filtered = useMemo(() => {
    let list = books
    if (filter !== 'all') list = list.filter((b) => b.status === filter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      )
    }
    return list
  }, [books, filter, search])

  async function handleAdd(data: Omit<Book, 'id' | 'created_at'>) {
    const newBook = await createBook(data)
    setBooks((prev) => [newBook, ...prev])
  }

  async function handleEdit(data: Omit<Book, 'id' | 'created_at'>) {
    if (!editingBook) return
    const updated = await updateBook(editingBook.id, data)
    setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
  }

  function openEdit(book: Book) {
    setEditingBook(book)
    setFormOpen(true)
  }

  function handleFormClose() {
    setFormOpen(false)
    setEditingBook(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpenCheck className="w-6 h-6 text-primary flex-shrink-0" />
            <h1 className="font-serif font-bold text-xl text-foreground truncate">
              나의 독서 노트
            </h1>
          </div>
          <Button onClick={() => setFormOpen(true)} size="sm" className="gap-1.5 flex-shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">책 추가하기</span>
            <span className="sm:hidden">추가</span>
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="제목 또는 저자로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="책 검색"
          />
        </div>

        {/* Status filter tabs */}
        <StatusFilter value={filter} onChange={setFilter} counts={counts} />

        {/* Book grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            불러오는 중...
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
            <p className="text-destructive font-medium">책 목록을 불러오지 못했어요.</p>
            <p className="text-sm text-muted-foreground">{loadError}</p>
          </div>
        ) : filtered.length > 0 ? (
          <section aria-label="책 목록">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} onEdit={openEdit} />
              ))}
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <BookOpenCheck className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-muted-foreground font-medium">
              {search ? '검색 결과가 없어요.' : '아직 책이 없어요.'}
            </p>
            <p className="text-sm text-muted-foreground/70">
              {search ? '다른 키워드로 검색해보세요.' : '"책 추가하기"로 첫 번째 책을 기록해보세요!'}
            </p>
            {!search && (
              <Button variant="outline" size="sm" onClick={() => setFormOpen(true)} className="mt-2 gap-1.5">
                <Plus className="w-4 h-4" />
                책 추가하기
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Floating add button (mobile) */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
          aria-label="책 추가하기"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <BookForm
        open={formOpen}
        onClose={handleFormClose}
        onSave={editingBook ? handleEdit : handleAdd}
        initialData={editingBook}
      />
    </main>
  )
}
