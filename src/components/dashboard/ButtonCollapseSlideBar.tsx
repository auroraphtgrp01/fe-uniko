'use client'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/hooks/useSidebar'
import React from 'react'
import { Icons } from '../ui/icons'
import { MenuIcon } from 'lucide-react'

export default function ButtonCollapseSlideBar() {
  const { isMinimized, toggle } = useSidebar()

  const handleToggle = () => {
    toggle()
  }
  return (
    <div className='hidden md:block lg:block'>
      <MenuIcon onClick={handleToggle} className='cursor-pointer' />
    </div>
  )
}
