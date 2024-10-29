'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import {
  endOfDay,
  format,
  getMonth,
  getYear,
  setMonth as setMonthFns,
  setYear,
  startOfDay,
  addMonths,
  subMonths,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
  subMonths as subMonthsFns
} from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { DayPicker, Matcher, DateRange, TZDate } from 'react-day-picker'

import { cn } from '@/libraries/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type DateRangeOption = {
  label: string
  value: string
  getRangeFn: () => DateRange
}

const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  {
    label: 'Today & Tomorrow',
    value: 'today-tomorrow',
    getRangeFn: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(addDays(new Date(), 1))
    })
  },
  {
    label: 'This Week',
    value: 'this-week',
    getRangeFn: () => ({
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date())
    })
  },
  {
    label: 'Last Week',
    value: 'last-week',
    getRangeFn: () => {
      const lastWeekStart = subDays(startOfWeek(new Date()), 7)
      return {
        from: lastWeekStart,
        to: endOfWeek(lastWeekStart)
      }
    }
  },
  {
    label: 'This Month',
    value: 'this-month',
    getRangeFn: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    label: 'Last Month',
    value: 'last-month',
    getRangeFn: () => {
      const lastMonth = subMonthsFns(new Date(), 1)
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      }
    }
  }
]

export type CalendarProps = Omit<React.ComponentProps<typeof DayPicker>, 'mode'>

export type DateRangePickerProps = {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  min?: Date
  max?: Date
  timezone?: string
  disabled?: boolean
  showTime?: boolean
  use12HourFormat?: boolean
  renderTrigger?: (props: DateRangeRenderTriggerProps) => React.ReactNode
}

export type DateRangeRenderTriggerProps = {
  value: DateRange | undefined
  open: boolean
  timezone?: string
  disabled?: boolean
  use12HourFormat?: boolean
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  renderTrigger,
  min,
  max,
  disabled,
  className,
  ...props
}: DateRangePickerProps & CalendarProps) {
  const [open, setOpen] = useState(false)
  const [monthYearPicker, setMonthYearPicker] = useState<'month' | 'year' | false>(false)
  const initFromDate = useMemo(() => new TZDate(value?.from || new Date()), [value?.from])
  const initToDate = useMemo(() => new TZDate(value?.to || new Date()), [value?.to])

  const [month, setMonth] = useState<Date>(initFromDate)
  const [range, setRange] = useState<DateRange | undefined>(value)
  const [selectedPreset, setSelectedPreset] = useState<string>('')

  const endMonth = useMemo(() => {
    return setYear(month, getYear(month) + 1)
  }, [month])
  const minDate = useMemo(() => (min ? new TZDate(min) : undefined), [min])
  const maxDate = useMemo(() => (max ? new TZDate(max) : undefined), [max])

  const onDayChanged = useCallback(
    (selectedRange: DateRange | undefined) => {
      if (!selectedRange?.from || !selectedRange?.to) {
        setRange(selectedRange)
        setSelectedPreset('')
        return
      }

      const adjustDate = (date: Date, initDate: Date) => {
        date = startOfDay(date)
        return date
      }

      let from = adjustDate(new Date(selectedRange.from), initFromDate)
      let to = adjustDate(new Date(selectedRange.to), initToDate)

      from = min && from < min ? min : from
      to = max && to > max ? max : to
      setRange({ from, to })
      setSelectedPreset('')
    },
    [setRange, initFromDate, initToDate, min, max]
  )

  const onPresetChanged = useCallback(
    (preset: string) => {
      const option = DATE_RANGE_OPTIONS.find((opt) => opt.value === preset)
      if (option) {
        const newRange = option.getRangeFn()
        if (newRange.from && min && newRange.from < min) newRange.from = min
        if (newRange.to && max && newRange.to > max) newRange.to = max
        setRange(newRange)
        setSelectedPreset(preset)
        if (newRange.from) {
          setMonth(newRange.from)
        }
      }
    },
    [min, max]
  )

  const onSubmit = useCallback(() => {
    if (range?.from && range?.to) {
      onChange({ from: new Date(range.from), to: new Date(range.to) })
    } else {
      onChange(undefined)
    }
    setOpen(false)
  }, [range, onChange])

  const onMonthYearChanged = useCallback(
    (d: Date, mode: 'month' | 'year') => {
      setMonth(d)
      if (mode === 'year') {
        setMonthYearPicker('month')
      } else {
        setMonthYearPicker(false)
      }
    },
    [setMonth, setMonthYearPicker]
  )

  const onNextMonth = useCallback(() => {
    setMonth(addMonths(month, 1))
  }, [month])

  const onPrevMonth = useCallback(() => {
    setMonth(subMonths(month, 1))
  }, [month])

  useEffect(() => {
    if (open) {
      setRange(value)
      setMonth(initFromDate)
      setMonthYearPicker(false)
      setSelectedPreset('')
    }
  }, [open, initFromDate, value])

  const displayValue = useMemo(() => {
    if (!open && !value) return undefined
    return open ? range : value
  }, [range, value, open])

  const displayFormat = useMemo(() => {
    if (!displayValue?.from || !displayValue?.to) return 'Pick a date range'
    return `${format(displayValue.from, `MMM d, yyyy`)} - ${format(displayValue.to, `MMM d, yyyy`)}`
  }, [displayValue])

  const [isDragging, setIsDragging] = useState(false)
  const [draggedRange, setDraggedRange] = useState<DateRange | undefined>(value)

  const onDayMouseEnter = (day: Date) => {
    if (isDragging && draggedRange?.from) {
      const newRange = { from: draggedRange.from, to: day }
      setDraggedRange(newRange)
    }
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {renderTrigger ? (
            renderTrigger({ value: displayValue, open, disabled })
          ) : (
            <Button
              disabled={disabled}
              variant={'outline'}
              className={cn('flex w-full justify-start px-3 font-normal', !displayValue && '')}
            >
              <CalendarIcon className='mr-2 size-4' />
              {displayFormat}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className='mt-1 w-full p-3'>
          <div className='flex items-center justify-between'>
            <div className={cn('flex space-x-2', monthYearPicker ? 'hidden' : '')}>
              <Button variant='ghost' size='icon' onClick={onPrevMonth}>
                <ChevronLeftIcon className='w-5' />
              </Button>
            </div>
            <div className='text-md flex cursor-pointer items-center pb-1 font-bold'>
              <Button
                className='w-full p-2'
                variant='ghost'
                size='icon'
                onClick={() => setMonthYearPicker(monthYearPicker === 'month' ? false : 'month')}
              >
                <span className=''>{format(month, 'MMMM')}</span>{' '}
              </Button>
              <Button
                className='w-full p-2'
                variant='ghost'
                size='icon'
                onClick={() => setMonthYearPicker(monthYearPicker ? false : 'year')}
              >
                <span className=''>{format(month, 'yyyy')}</span>{' '}
              </Button>
            </div>
            <div className={cn('flex space-x-2', monthYearPicker ? 'hidden' : '')}>
              <Button variant='ghost' size='icon' onClick={onNextMonth}>
                <ChevronRightIcon className='w-5' />
              </Button>
            </div>
          </div>
          <div className={cn('w-full pt-1', monthYearPicker ? 'hidden' : '')}>
            <Select value={selectedPreset} onValueChange={onPresetChanged}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Date Range' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Date Range</SelectLabel>
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='relative overflow-hidden'>
            <DayPicker
              mode='range'
              selected={range}
              onSelect={onDayChanged}
              month={month}
              endMonth={endMonth}
              disabled={[max ? { after: max } : null, min ? { before: min } : null].filter(Boolean) as Matcher[]}
              onMonthChange={setMonth}
              classNames={{
                dropdowns: 'flex w-full gap-2',
                months: 'flex w-full h-fit',
                month: 'flex flex-col w-full',
                month_caption: 'hidden',
                button_previous: 'hidden',
                button_next: 'hidden',
                month_grid: 'w-full border-collapse',
                weekdays: 'flex justify-between mt-2',
                weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                week: 'flex w-full justify-between mt-2',
                day: 'h-10 w-10 mx-1 text-center text-sm relative flex items-center justify-center',
                day_button: cn(
                  buttonVariants({ variant: 'ghost' }),
                  'rounded-md font-normal transition-all hover:bg-primary dark:text-white hover:text-primary-foreground'
                ),
                selected:
                  'bg-primary h-10 w-10 text-primary-foreground dark:text-white hover:bg-primary focus:bg-primary focus:text-primary-foreground rounded-md border border-primary-light shadow-md',
                today: 'bg-accent text-accent-foreground rounded-md',
                outside:
                  'text-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                disabled: 'text-muted-foreground opacity-50',
                range_middle: 'bg-accent-light text-accent-foreground rounded-md',
                hidden: 'invisible'
              }}
              showOutsideDays={true}
              {...props}
            />

            <div
              className={cn('absolute bottom-0 left-0 right-0 top-0', monthYearPicker ? 'bg-popover' : 'hidden')}
            ></div>
            <MonthYearPicker
              value={month}
              mode={monthYearPicker as any}
              onChange={onMonthYearChanged}
              minDate={minDate}
              maxDate={maxDate}
              className={cn('absolute bottom-0 left-0 right-0 top-0', monthYearPicker ? '' : 'hidden')}
            />
          </div>
          <Button className='mt-4 w-full' onClick={onSubmit}>
            Done
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
function MonthYearPicker({
  value,
  minDate,
  maxDate,
  mode = 'month',
  onChange,
  className
}: {
  value: Date
  mode: 'month' | 'year'
  minDate?: Date
  maxDate?: Date
  onChange: (value: Date, mode: 'month' | 'year') => void
  className?: string
}) {
  const yearRef = useRef<HTMLDivElement>(null)
  const years = useMemo(() => {
    const years: TimeOption[] = []
    const startYear = minDate ? getYear(minDate) : 1912
    const endYear = maxDate ? getYear(maxDate) : 2100
    for (let i = startYear; i <= endYear; i++) {
      let disabled = false
      const startY = startOfYear(setYear(value, i))
      const endY = endOfYear(setYear(value, i))
      if (minDate && endY < minDate) disabled = true
      if (maxDate && startY > maxDate) disabled = true
      years.push({ value: i, label: i.toString(), disabled })
    }
    return years
  }, [value, minDate, maxDate])
  const months = useMemo(() => {
    const months: TimeOption[] = []
    for (let i = 0; i < 12; i++) {
      let disabled = false
      const startM = startOfDay(setMonthFns(value, i))
      const endM = endOfDay(setMonthFns(value, i))
      if (minDate && endM < minDate) disabled = true
      if (maxDate && startM > maxDate) disabled = true
      months.push({ value: i, label: format(new Date(0, i), 'MMM'), disabled })
    }
    return months
  }, [value, minDate, maxDate])

  const onYearChange = useCallback(
    (v: TimeOption) => {
      let newDate = setYear(value, v.value)
      const adjustDateWithinBounds = (
        date: Date,
        limit: Date | undefined,
        comparator: (a: Date, b: Date) => boolean
      ) => {
        return limit && comparator(date, limit) ? setMonthFns(date, getMonth(limit)) : date
      }

      newDate = adjustDateWithinBounds(newDate, minDate, (a, b) => a < b)
      newDate = adjustDateWithinBounds(newDate, maxDate, (a, b) => a > b)
      onChange(newDate, 'year')
    },
    [onChange, value, minDate, maxDate]
  )
  useEffect(() => {
    if (mode === 'year') {
      yearRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' })
    }
  }, [mode, value])
  return (
    <div className={cn(className)}>
      <ScrollArea className='h-full'>
        {mode === 'year' && (
          <div className='grid grid-cols-4'>
            {years.map((year) => (
              <div key={year.value} ref={year.value === getYear(value) ? yearRef : undefined}>
                <Button
                  disabled={year.disabled}
                  variant={getYear(value) === year.value ? 'default' : 'ghost'}
                  className='rounded-full'
                  onClick={() => onYearChange(year)}
                >
                  {year.label}
                </Button>
              </div>
            ))}
          </div>
        )}
        {mode === 'month' && (
          <div className='grid grid-cols-3 gap-4'>
            {months.map((month) => (
              <Button
                key={month.value}
                size='lg'
                disabled={month.disabled}
                variant={getMonth(value) === month.value ? 'default' : 'ghost'}
                className='rounded-full'
                onClick={() => onChange(setMonthFns(value, month.value), 'month')}
              >
                {month.label}
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

interface TimeOption {
  value: number
  label: string
  disabled: boolean
}
