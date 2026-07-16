'use client'

import { BookStatus, STATUS_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'

type FilterValue = BookStatus | 'all'

interface StatusFilterProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
  counts: Record<FilterValue, number>
}

const TABS: { label: string; value: FilterValue }[] = [
  { label: '전체', value: 'all' },
  { label: STATUS_LABELS.reading, value: 'reading' },
  { label: STATUS_LABELS.completed, value: 'completed' },
  { label: STATUS_LABELS.want_to_read, value: 'want_to_read' },
]

export function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
  return (
    <nav aria-label="독서 상태 필터" className="flex gap-1 overflow-x-auto pb-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            value === tab.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
          aria-current={value === tab.value ? 'page' : undefined}
        >
          {tab.label}
          <span
            className={cn(
              'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-semibold',
              value === tab.value
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {counts[tab.value]}
          </span>
        </button>
      ))}
    </nav>
  )
}
