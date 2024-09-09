'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { motion } from 'framer-motion'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant='ghost'
      size='icon'
      className='relative rounded-full'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {/* Animate the sun icon */}
      <motion.div
        key='sun-icon'
        initial={{ opacity: 1, rotate: 0, scale: 1 }}
        animate={{
          opacity: theme === 'light' ? 1 : 0,
          rotate: theme === 'light' ? 0 : 90,
          scale: theme === 'light' ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <Icons.cloudSun className='h-[1.2rem] w-[1.2rem]' />
      </motion.div>

      {/* Animate the moon icon */}
      <motion.div
        key='moon-icon'
        initial={{ opacity: 0, rotate: 90, scale: 0 }}
        animate={{
          opacity: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : 90,
          scale: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className='absolute'
      >
        <Icons.moonStar className='h-[1.2rem] w-[1.2rem]' />
      </motion.div>
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
