import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'
import { locales } from '@/libraries/i18n'

export default function ButtonLanguage() {
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const changeLanguage = (languageCode: 'en' | 'vi') => i18n.changeLanguage(languageCode)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative rounded-full'>
          {currentLanguage}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-20 md:w-40'>
        <DropdownMenuItem
          className='flex cursor-pointer items-start space-x-3 p-3'
          onClick={() => changeLanguage('vi')}
        >
          Vietnamese
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex cursor-pointer items-start space-x-3 p-3'
          onClick={() => changeLanguage('en')}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
