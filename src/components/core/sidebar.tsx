'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { DashboardNav } from '@/components/core/dashboard-nav'
import { navItems } from '@/constants/routes'
import { cn } from '@/libraries/utils'
import { useSidebar } from '@/hooks/useSidebar'
import Image from 'next/image'
import Logo2 from '@/images/logo-2.png'
import Logo3 from '@/images/logo-3.png'

type SidebarProps = {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized } = useSidebar()

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-background_nav transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-52' : 'w-[72px]',
        className
      )}
    >
      <div className='mt-[-10px] hidden select-none p-5 md:block lg:block'>
        {!isMinimized ? (
          <motion.div
            className='justify-start'
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='w-full'>
              <Image
                src={Logo3}
                alt='Logo'
                layout='responsive'
                objectFit='cover'
                className='h-full w-full object-cover'
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            className='mt-1 justify-start'
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='w-full'>
              <Image
                src={Logo2}
                alt='Logo'
                layout='responsive'
                objectFit='cover'
                className='h-full w-full object-cover'
              />
            </div>
          </motion.div>
        )}
      </div>
      <div className='space-y-4'>
        <div className='px-3 py-2'>
          <div className='select-none space-y-1'>
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  )
}
