'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Book, BookStatus, STATUS_LABELS } from '@/lib/types'
import { RatingStars } from './rating-stars'
import { cn } from '@/lib/utils'

interface BookFormProps {
  open: boolean
  onClose: () => void
  onSave: (book: Omit<Book, 'id' | 'created_at'>) => void | Promise<void>
  initialData?: Book | null
}

const STATUS_OPTIONS: { value: BookStatus; label: string }[] = [
  { value: 'reading', label: STATUS_LABELS.reading },
  { value: 'completed', label: STATUS_LABELS.completed },
  { value: 'want_to_read', label: STATUS_LABELS.want_to_read },
]

const defaultForm = {
  title: '',
  author: '',
  cover_url: '',
  status: 'want_to_read' as BookStatus,
  rating: null as number | null,
  memo: '',
  started_at: '',
  finished_at: '',
}

export function BookForm({ open, onClose, onSave, initialData }: BookFormProps) {
  const [form, setForm] = useState(() =>
    initialData
      ? {
          title: initialData.title,
          author: initialData.author,
          cover_url: initialData.cover_url ?? '',
          status: initialData.status,
          rating: initialData.rating,
          memo: initialData.memo ?? '',
          started_at: initialData.started_at ?? '',
          finished_at: initialData.finished_at ?? '',
        }
      : defaultForm
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onSave({
        title: form.title.trim(),
        author: form.author.trim(),
        cover_url: form.cover_url.trim() || null,
        status: form.status,
        rating: form.rating,
        memo: form.memo.trim() || null,
        started_at: form.started_at || null,
        finished_at: form.finished_at || null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            {initialData ? '책 수정하기' : '책 추가하기'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">
              제목 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="책 제목을 입력하세요"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </div>

          {/* Author */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="author">
              저자 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="author"
              placeholder="저자 이름을 입력하세요"
              value={form.author}
              onChange={(e) => set('author', e.target.value)}
              required
            />
          </div>

          {/* Cover URL */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cover_url">표지 이미지 URL</Label>
            <Input
              id="cover_url"
              placeholder="https://example.com/cover.jpg"
              value={form.cover_url}
              onChange={(e) => set('cover_url', e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <Label>독서 상태</Label>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('status', opt.value)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                    form.status === opt.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-muted'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1.5">
            <Label>별점</Label>
            <div className="flex items-center gap-3">
              <RatingStars value={form.rating} onChange={(r) => set('rating', r)} size="lg" />
              {form.rating && (
                <button
                  type="button"
                  onClick={() => set('rating', null)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  초기화
                </button>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="started_at">시작일</Label>
              <Input
                id="started_at"
                type="date"
                value={form.started_at}
                onChange={(e) => set('started_at', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="finished_at">완독일</Label>
              <Input
                id="finished_at"
                type="date"
                value={form.finished_at}
                onChange={(e) => set('finished_at', e.target.value)}
              />
            </div>
          </div>

          {/* Memo */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="memo">감상 메모</Label>
            <Textarea
              id="memo"
              placeholder="책을 읽고 느낀 점을 자유롭게 적어보세요..."
              value={form.memo}
              onChange={(e) => set('memo', e.target.value)}
              rows={4}
              className="resize-none leading-relaxed"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              취소
            </Button>
            <Button type="submit" disabled={!form.title.trim() || !form.author.trim() || saving}>
              {saving ? '저장 중...' : initialData ? '수정 완료' : '추가하기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
