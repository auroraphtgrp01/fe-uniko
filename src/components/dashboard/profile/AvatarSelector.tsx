import React, { use } from 'react'
import { useState, useEffect } from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { avatarPath } from '@/constants/avatar'
import Image from 'next/image'
import { IDynamicType } from '@/types/common.i'

export default function AvatarSelector({
  onSelect,
  value
}: {
  onSelect: ({ avatarId }: { avatarId: string } & IDynamicType) => void
  value?: string
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(!value)

  useEffect(() => {
    setIsOpen(false)
  }, [selectedAvatar])

  useEffect(() => {
    if (value) {
      setSelectedAvatar(value)
      setIsLoading(false)
    }
  }, [value])

  return (
    <div className='mx-auto w-full max-w-3xl p-4'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <motion.button
            className='mx-auto block overflow-hidden rounded-full ring-2 ring-primary hover:ring-primary focus:outline-none'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
          >
            <Avatar
              className={`h-32 w-32 border-4 bg-gradient-to-r from-primary to-primary/60 ${isLoading ? 'animate-pulse' : ''}`}
            >
              {!isLoading && (
                <Image
                  priority
                  src={`/avatars/${selectedAvatar}.png`}
                  alt='Selected avatar'
                  width={128}
                  height={128}
                  quality={90}
                />
              )}
            </Avatar>
          </motion.button>
        </PopoverTrigger>
        <PopoverContent className='ms-2 mt-5 w-[400px]' side='right'>
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Avatar</CardTitle>
            </CardHeader>
            <CardContent className='p-1 py-2'>
              <ScrollArea className='h-[400px] px-3 pr-5'>
                <div className='grid grid-cols-5 gap-3'>
                  {avatarPath.map((avatar, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setSelectedAvatar(avatar)
                        onSelect({ avatarId: avatar })
                      }}
                      className='overflow-hidden rounded-full focus:outline-none'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Avatar className='h-12 w-12 border-2'>
                        <Image
                          loading='lazy'
                          width={48}
                          height={48}
                          src={`/avatars/${avatar}.png`}
                          alt={`Avatar option ${index + 1}`}
                          quality={60}
                          blurDataURL={`/avatars/${avatar}.png`}
                          placeholder='blur'
                        />
                      </Avatar>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}
