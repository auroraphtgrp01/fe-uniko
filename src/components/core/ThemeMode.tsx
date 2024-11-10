import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'
import React, { useEffect } from 'react'

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
        <Button variant='ghost' size='icon' className='relative rounded-full'>
          <Palette className='h-5 w-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {THEMES.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => handleThemeChange(theme)} className='cursor-pointer'>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
