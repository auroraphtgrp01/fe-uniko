'use client'
import { DashboardNav } from '@/components/core/dashboard-nav'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { navItems } from '@/constants/routes'
import { cn } from '@/libraries/utils'
import { MenuIcon } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side='left' className={cn(className, '!px-0')}>
          <div className='space-y-4 py-4'>
            <div className='px-3 py-2'>
              <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>Menu</h2>
              <div className='space-y-1'>
                <DashboardNav items={navItems} isMobileNav={true} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
