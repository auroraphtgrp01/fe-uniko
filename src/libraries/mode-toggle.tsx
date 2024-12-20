'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { motion } from 'framer-motion'

export function ModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  const currentTheme = theme === 'system' ? systemTheme : theme

  React.useEffect(() => {
    setMounted(true)
    if (!theme || theme === 'system') {
      setTheme('dark')
    }
  }, [setTheme, theme])

  if (!mounted) {
    return (
      <Button
        variant='ghost'
        size='icon'
        className='mt-0.5 h-7 select-none rounded-full !border-0 p-0 outline-none hover:bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
      >
        <Icons.moonStar className='h-[1.2rem] w-[1.2rem]' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='mt-0.5 h-7 select-none rounded-full !border-0 p-0 outline-none hover:bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
      onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
    >
      <motion.div
        key='sun-icon'
        initial={{ opacity: 1, rotate: 0, scale: 1 }}
        animate={{
          opacity: currentTheme === 'light' ? 1 : 0,
          rotate: currentTheme === 'light' ? 0 : 90,
          scale: currentTheme === 'light' ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <Icons.cloudSun className='h-[1.2rem] w-[1.2rem]' />
      </motion.div>

      <motion.div
        key='moon-icon'
        initial={{ opacity: 0, rotate: 90, scale: 0 }}
        animate={{
          opacity: currentTheme === 'dark' ? 1 : 0,
          rotate: currentTheme === 'dark' ? 0 : 90,
          scale: currentTheme === 'dark' ? 1 : 0
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
