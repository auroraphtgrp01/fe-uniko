'use client'

import React, { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
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
  onValueSelect: (value: string) => void
}

export function Combobox({ className, label, dataArr, dialogEdit, setOpenEditDialog, onValueSelect }: IComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const filteredDataArr = dataArr.filter((data) => data.label.toLowerCase().includes(searchValue.trim().toLowerCase()))

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue
    setValue(newValue)
    onValueSelect(newValue)
    setOpen(false)
    setSearchValue('')
  }

  return (
    <div className={cn(className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
            {value ? dataArr.find((data) => data.value === value)?.label : `Select ${label ?? 'item'}`}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-2'>
          <Command shouldFilter={false}>
            <CommandInput
              value={searchValue}
              onValueChange={setSearchValue}
              placeholder={`Search ${label ?? 'item'}`}
            />
            <CommandList>
              {filteredDataArr.length > 0 ? (
                <CommandGroup>
                  {filteredDataArr.map((data) => (
                    <CommandItem key={data.value} value={data.value} onSelect={() => handleSelect(data.value)}>
                      <div className='flex w-full justify-between'>
                        {data.label}
                        <Check className={cn('h-4 w-4', value === data.value ? 'opacity-100' : 'opacity-0')} />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>No items found</CommandEmpty>
              )}
            </CommandList>
          </Command>
          {setOpenEditDialog && (
            <Button className='mt-4 w-full' variant='outline' onClick={() => setOpenEditDialog(true)}>
              Edit {label ?? 'item'}
            </Button>
          )}
        </PopoverContent>
      </Popover>
      {dialogEdit}
    </div>
  )
}
