'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Book, STATUS_LABELS, STATUS_COLORS } from '@/lib/types'
import { RatingStars } from './rating-stars'
import { cn } from '@/lib/utils'

interface BookCardProps {
  book: Book
  onEdit?: (book: Book) => void
}

export function BookCard({ book, onEdit }: BookCardProps) {
  return (
    <article className="group relative flex flex-col bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Cover image */}
      <Link href={`/books/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-muted">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={`${book.title} 표지`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
            <BookOpen className="w-10 h-10 opacity-40" />
            <span className="text-xs text-center px-3 leading-snug opacity-60">{book.title}</span>
          </div>
        )}

        {/* Status badge overlay */}
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
              STATUS_COLORS[book.status]
            )}
          >
            {STATUS_LABELS[book.status]}
          </span>
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <Link href={`/books/${book.id}`} className="block">
          <h3 className="font-serif font-semibold text-sm leading-snug text-foreground line-clamp-2 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground truncate">{book.author}</p>

        <div className="mt-auto pt-1.5 flex items-center justify-between">
          {book.rating ? (
            <RatingStars value={book.rating} readOnly size="sm" />
          ) : (
            <span className="text-xs text-muted-foreground italic">미평가</span>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(book)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors px-1"
              aria-label={`${book.title} 수정`}
            >
              수정
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
