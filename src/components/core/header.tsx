'use client'
import { ModeToggle } from '@/libraries/mode-toggle'
import { MobileSidebar } from '@/components/core/mobile-sidebar'
import { UserNav } from '@/components/core/user-nav'
import ButtonCollapseSlideBar from '../dashboard/ButtonCollapseSlideBar'
import NotificationDropdown from '../dashboard/Notification'
import ButtonLanguage from '@/components/core/ButtonLanguage'

export default function Header() {
  return (
    <header className='sticky w-full'>
      <nav className='flex items-center justify-between px-4 py-2'>
        <div className='md:hidden lg:hidden'>
          <MobileSidebar />
        </div>
        <div className='flex items-center gap-2'>
          <ButtonCollapseSlideBar />
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <ButtonLanguage />
          <NotificationDropdown />
          <ModeToggle />
          <UserNav />
        </div>
      </nav>
    </header>
  )
}
