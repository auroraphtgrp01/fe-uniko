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
import Link from 'next/link'

type SidebarProps = {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized } = useSidebar()

  return (
    <aside
      className={cn(
        `relative z-50 hidden min-h-[100vh] flex-none border-r bg-background_nav transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-52' : 'w-16',
        className
      )}
    >
      <Link href={'/'}>
        <div className='mt-[-5px] hidden select-none p-4 md:block lg:block'>
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
      </Link>
      <div className='space-y-2'>
        <div className='px-2 py-2'>
          <div className='select-none space-y-1'>
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  )
}
