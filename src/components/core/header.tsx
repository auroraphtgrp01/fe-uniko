import { ModeToggle } from '@/libraries/mode-toggle'
import { cn } from '@/libraries/utils'
import { MobileSidebar } from '@/components/core/mobile-sidebar'
import { UserNav } from '@/components/core/user-nav'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className='sticky inset-x-0 top-0 mt-3 w-full'>
      <nav className='flex items-center justify-between px-4 py-2 md:justify-end'>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>

        <div className='flex items-center gap-2'>
          <UserNav />
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}
