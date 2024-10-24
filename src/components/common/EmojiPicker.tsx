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

  const onSelectEmoji = (item: IEmoji) => {
    onChangeValue(item)
    setEmoji(item)
    setIsOpenPopover(false)
  }

  return (
    <div className={cn(className)}>
      <Popover>
        <PopoverTrigger>
          <Button variant={'outline'} className='h-10 w-10' type='button'>
            {emoji?.native}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='border-none bg-transparent bg-none'>
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
