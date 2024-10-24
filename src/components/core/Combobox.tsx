'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Delete } from 'lucide-react'

import { cn } from '@/libraries/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface IComboboxProps {
  className?: string
  label?: string
  dataArr: { value: string; label: string }[]
  dialogEdit?: React.ReactNode
  setOpenEditDialog?: React.Dispatch<React.SetStateAction<boolean>>
}

export function Combobox({ className, label, dataArr, dialogEdit, setOpenEditDialog }: IComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <div className={cn(className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
            {value ? dataArr.find((data) => data.value === value)?.label : `Select ${label ? label : 'item'}`}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-2'>
          <Command>
            <CommandInput placeholder={`Search ${label ? label : 'item'}`} />
            <CommandList>
              <CommandEmpty>No {label ? label : 'item'} found.</CommandEmpty>
              <CommandGroup>
                {dataArr.map((data) => (
                  <CommandItem
                    key={data.value}
                    value={data.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                  >
                    <div className='flex w-full justify-between'>
                      {data.label}
                      <Check className={cn('h-4 w-4', value === data.value ? 'opacity-100' : 'opacity-0')} />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {setOpenEditDialog && (
            <Button
              className='mt-4 w-full'
              variant={'outline'}
              onClick={() => {
                setOpenEditDialog(true)
              }}
            >
              Edit {label ? label : 'item'}
            </Button>
          )}
        </PopoverContent>
      </Popover>
      {dialogEdit}
    </div>
  )
}
