'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  value: number | null
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function RatingStars({ value, onChange, readOnly = false, size = 'md' }: RatingStarsProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }

  const active = hovered ?? value ?? 0

  return (
    <div
      className={cn('flex items-center gap-0.5', !readOnly && 'cursor-pointer')}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`별점: ${value ?? 0}점`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(null)}
          className={cn(
            'transition-colors focus:outline-none',
            readOnly ? 'cursor-default' : 'hover:scale-110 transition-transform'
          )}
          aria-label={`${star}점`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= active
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-muted-foreground/40'
            )}
          />
        </button>
      ))}
    </div>
  )
}
