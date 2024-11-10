'use client'
import { useSidebar } from '@/hooks/useSidebar'
import React from 'react'
import { MenuIcon } from 'lucide-react'

export default function ButtonCollapseSlideBar() {
  const { toggle } = useSidebar()

  const handleToggle = () => {
    toggle()
  }
  return (
    <div className='hidden md:block lg:block'>
      <MenuIcon onClick={handleToggle} className='cursor-pointer' width={20} height={20} />
    </div>
  )
}
