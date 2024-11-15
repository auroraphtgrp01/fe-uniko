import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

const THEMES = ['default', 'modern', 'purple', 'blue']

export default function ThemeMode() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'default'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleThemeChange = (value: string) => {
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem('app-theme', value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='mt-0.5 h-7 select-none rounded-full !border-0 p-0 outline-none hover:bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='flex items-center gap-2'>
            <Palette className='h-5 w-5' />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mt-5 w-56 select-none' align='center' sideOffset={5}>
        <DropdownMenuGroup>
          <div className='px-2 py-1.5 text-center text-sm font-semibold text-muted-foreground'>
            <span>Select Theme</span>
          </div>
          <DropdownMenuSeparator />
          {THEMES.map((theme, index) => (
            <React.Fragment key={theme}>
              {index !== 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem className='cursor-pointer' onClick={() => handleThemeChange(theme)}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
