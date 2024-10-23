'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { getAccessTokenFromLocalStorage, getBaseClientUrl, getUserInfoFromLocalStorage } from '@/libraries/helpers'
import Link from 'next/link'
import { useUser } from '@/core/users/hooks'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AvatarDefault from '@/images/avatar.jpg'
import Image from 'next/image'
import { useAuth } from '@/core/auth/hooks'

export function UserNav() {
  const baseUrl = getBaseClientUrl()
  const router = useRouter()
  const [isLogout, setIsLogout] = useState(false)
  const user = getUserInfoFromLocalStorage()
  console.log('user', user)

  useEffect(() => {
    if (isLogout === true) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      setIsLogout(false)
      router.push(baseUrl)
    }
  }, [isLogout])
  return (
    <div className='ms-1 select-none'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-10 w-10 rounded-full p-0'>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className='h-full w-full rounded-full'>
              <Avatar className='rounded-full hover:cursor-pointer'>
                {/* <AvatarImage
                  className='h-full w-full object-cover'
                  src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${user?.avatar}`}
                /> */}
                <Image alt='' className='h-full w-full object-cover' src={AvatarDefault as any} />
                <AvatarFallback>
                  <img
                    src='https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/avatar-cute-dong-vat-1725201830.jpg'
                    className='h-full w-full object-cover'
                  />
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{user?.fullName}</p>
              <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
            </div>
          </DropdownMenuLabel>
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
          <DropdownMenuItem
            onClick={() => {
              const accessToken = getAccessTokenFromLocalStorage()
              if (accessToken) setIsLogout(true)
            }}
          >
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
