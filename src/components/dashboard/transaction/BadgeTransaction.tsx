import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@/libraries/utils'

interface TransactionBadgeProps {
  direction: 'INCOMING' | 'OUTGOING' | string
  name: string
}

export default function TransactionBadge({ direction, name }: TransactionBadgeProps) {
  const isIncoming = direction === 'INCOMING'

  return (
    <div
      className={cn(
        'relative flex min-w-[140px] max-w-[180px] items-center justify-center',
        'group overflow-hidden rounded-xl border border-opacity-20',
        'transition-all duration-500 hover:scale-105',
        isIncoming ? 'border-emerald-200 hover:border-emerald-300' : 'border-rose-200 hover:border-rose-300'
      )}
    >
      {/* Gradient background with animation */}
      <div
        className={cn(
          'absolute inset-0 opacity-20 transition-opacity duration-500',
          'group-hover:opacity-40',
          isIncoming
            ? 'bg-gradient-to-r from-emerald-200 via-green-200 to-teal-200'
            : 'bg-gradient-to-r from-rose-200 via-pink-200 to-red-200'
        )}
      />

      {/* Content container */}
      <div className='relative z-10 flex w-full items-center justify-between gap-3 px-4 py-2.5'>
        {/* Icon */}
        {isIncoming ? (
          <ArrowDownLeft className='h-4 w-4 text-emerald-600' />
        ) : (
          <ArrowUpRight className='h-4 w-4 text-rose-600' />
        )}

        {/* Transaction name */}
        <span
          className={cn(
            'flex-1 truncate text-sm font-medium',
            'transition-colors duration-300',
            isIncoming ? 'text-emerald-700' : 'text-rose-700'
          )}
        >
          {name || 'N/A'}
        </span>
      </div>
    </div>
  )
}
