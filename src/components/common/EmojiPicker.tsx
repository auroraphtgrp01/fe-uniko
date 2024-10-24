'use client'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { defaultEmoji } from '@/constants/defaultValue'
import { cn } from '@/libraries/utils'
import { IEmoji } from '@/types/common.i'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useState, useRef, useEffect } from 'react'

export function EmojiPicker({
  onChangeValue,
  className
}: {
  onChangeValue: (value: IEmoji) => void
  className?: string
}) {
  const [emoji, setEmoji] = useState<IEmoji>(defaultEmoji)
  const [isOpenPopover, setIsOpenPopover] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const onSelectEmoji = (item: IEmoji) => {
    onChangeValue(item)
    setEmoji(item)
    setIsOpenPopover(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpenPopover(false)
      }
    }
    if (isOpenPopover) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpenPopover])

  return (
    <div className={cn(className)}>
      <Popover open={isOpenPopover}>
        <PopoverTrigger>
          <Button
            variant={'outline'}
            className='h-10 w-10'
            onClick={() => {
              setIsOpenPopover(!isOpenPopover)
            }}
          >
            {emoji?.native}
          </Button>
        </PopoverTrigger>
        <PopoverContent ref={popoverRef} className='border-none bg-transparent bg-none'>
          <Picker
            className='bg-transparent'
            previewPosition={'none'}
            data={data}
            categories={['activity', 'objects', 'places', 'foods', 'symbols', 'flags', 'people']}
            onEmojiSelect={(item: IEmoji) => {
              onSelectEmoji(item)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
