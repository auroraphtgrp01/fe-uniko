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
    <>
      {currentLanguage === 'en' ? (
        <Button onClick={() => changeLanguage('vi')} variant='ghost' size='icon' className='relative rounded-full'>
          <span>{currentLanguage}</span>
        </Button>
      ) : (
        <Button onClick={() => changeLanguage('en')} variant='ghost' size='icon' className='relative rounded-full'>
          <span>{currentLanguage}</span>
        </Button>
      )}
    </>
  )
}
