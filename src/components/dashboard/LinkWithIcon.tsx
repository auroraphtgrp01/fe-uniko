import { Icons } from '@/components/ui/icons'
import { cn } from '@/libraries/utils'
import { NavItem } from '@/types/core.i'
import Link from 'next/link'
import React from 'react'

export default function LinkWithIcon({
  item,
  path,
  setOpen
}: {
  item: NavItem
  path: string
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const Icon = Icons[item.icon || 'arrowRight']
  return (
    <div>
      <Link
        href={(item.disabled ? '/' : item.href) as string}
        className={cn(
          'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-primary hover:text-white',
          path === item.href ? 'bg-primary text-white' : 'transparent',
          item.disabled && 'cursor-not-allowed opacity-80'
        )}
        onClick={() => {
          if (setOpen) setOpen(false)
        }}
      >
        <Icon className={`ml-3 size-5 flex-none`} src='' alt='' />
      </Link>
    </div>
  )
}
