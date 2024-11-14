'use client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AvatarDefault from '@/images/avatar.jpg'
import Image from 'next/image'
import { useAuth } from '@/core/auth/hooks'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/core/users/hooks'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { locales } from '@/libraries/i18n'

export function UserNav() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, setUser } = useStoreLocal()
  const { useLogout } = useAuth()
  const { getMe } = useUser()
  const { executeGetMe, userGetMeData } = getMe(false)
  const { executeLogout, userLogoutData } = useLogout()
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const changeLanguage = (languageCode: 'en' | 'vi') => i18n.changeLanguage(languageCode)
  const logOut = () => {
    queryClient.clear()
    executeLogout()
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    router.push('/')
  }
  useEffect(() => {
    if (!user && !userLogoutData) {
      executeGetMe()
      if (userGetMeData?.data) {
        setUser(userGetMeData.data)
      }
    }
  }, [user, userGetMeData, executeGetMe, setUser])
  return (
    <div className='ms-1 mt-1 select-none pr-4'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            className='h-full w-full overflow-hidden rounded-full ring-2 ring-primary hover:ring-primary focus:outline-none'
          >
            <Avatar className='h-full w-full rounded-full border-2 bg-gradient-to-r from-primary to-primary/60'>
              {user?.avatarId ? (
                <Image
                  alt='User avatar'
                  loading='lazy'
                  className='h-full w-full rounded-full object-cover'
                  src={`/avatars/${user?.avatarId}.png`}
                  width={25}
                  height={25}
                />
              ) : (
                <AvatarFallback className='animate-pulse'>
                  <div className='h-full w-full bg-muted' />
                </AvatarFallback>
              )}
            </Avatar>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mt-5 w-56 translate-x-5' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{user?.fullName}</p>
              <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => changeLanguage(currentLanguage === 'en' ? 'vi' : 'en')}>
              {currentLanguage === 'en' ? 'Tiếng Việt' : 'English'}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href='http://localhost:3000/dashboard/profile'>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='cursor-pointer' onClick={logOut}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
