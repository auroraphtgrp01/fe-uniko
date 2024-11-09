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

export function UserNav() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, setUser } = useStoreLocal()
  const { useLogout } = useAuth()
  const { getMe } = useUser()
  const { executeGetMe, userGetMeData } = getMe(false)
  const { executeLogout } = useLogout()
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
    if (!user) {
      executeGetMe()
      setUser(userGetMeData?.data as any)
    }
  }, [])
  return (
    <div className='ms-1 mt-1 select-none pr-4'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-5 w-5 rounded-full p-0'>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className='h-full w-full rounded-full'>
              <Avatar className='h-8 w-8 rounded-full hover:cursor-pointer'>
                {/* <AvatarImage
                  className='h-full w-full object-cover'
                  src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${user?.avatar}`}
                /> */}
                <Image
                  alt=''
                  priority
                  className='h-full w-full object-cover'
                  src={AvatarDefault as any}
                  width={20}
                  height={20}
                />
                {/* <AvatarFallback>
                  <img
                    src='https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/avatar-cute-dong-vat-1725201830.jpg'
                    className='h-full w-full object-cover'
                  />
                </AvatarFallback> */}
              </Avatar>
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mt-6 w-56 translate-x-5' align='end' forceMount>
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
          <DropdownMenuItem className='cursor-pointer' onClick={logOut}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
