'use client'
import React from 'react'
import CardInHeader from '@/components/dashboard/CardInHeader'
import { DateTimePicker } from '../../components/core/DateTimePicker'
import { DateRangePicker } from '../../components/core/DateRangePicker'
import { Combobox } from '../../components/core/Combobox'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'

export default function DashboardMainForm() {
  const [openEditDialog, setOpenEditDialog] = React.useState(false)
  const [data, setData] = React.useState([
    {
      value: 'Apple',
      label: 'Apple'
    },
    {
      value: 'Banana',
      label: 'Banana'
    },
    {
      value: 'Cherry',
      label: 'Cherry'
    },
    {
      value: 'Date',
      label: 'Date'
    },
    {
      value: 'Elderberry',
      label: 'Elderberry'
    },
    {
      value: 'Fig',
      label: 'Fig'
    },
    {
      value: 'Grape',
      label: 'Grape'
    },
    {
      value: 'Honeydew',
      label: 'Honeydew'
    },
    {
      value: 'Iced tea',
      label: 'Iced tea'
    },
    {
      value: 'Jackfruit',
      label: 'Jackfruit'
    },
    {
      value: 'Kiwi',
      label: 'Kiwi'
    },
    {
      value: 'Lemon',
      label: 'Lemon'
    },
    {
      value: 'Mango',
      label: 'Mango'
    },
    {
      value: 'Nectarine',
      label: 'Nectarine'
    },
    {
      value: 'Orange',
      label: 'Orange'
    }
  ])

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='flex w-full flex-col md:col-span-1'>
        <div className='grid flex-1 grid-cols-1 gap-4'>
          <Combobox
            onValueSelect={(newValue) => {}}
            setOpenEditDialog={setOpenEditDialog}
            dataArr={data}
            dialogEdit={EditTrackerTypeDialog({
              openEditDialog: openEditDialog,
              setOpenEditDialog: setOpenEditDialog,
              dataArr: data
            })}
            label='Tracker Transaction Type'
          />
          <DateTimePicker
            onChange={() => {}}
            value={new Date('2024-10-22T01:25:55.239Z')}
            showTime={true}
            use12HourFormat={true}
          />
          <DateRangePicker onChange={(range) => {}}></DateRangePicker>
          <CardInHeader className='h-full w-full' />
        </div>
      </div>
      <div className='flex w-full flex-col md:col-span-2'>
        <div className='grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2'>
          <CardInHeader className='h-full w-full' />
          <CardInHeader className='h-full w-full' />
        </div>
        <div className='mt-4 flex-1'>
          <CardInHeader className='h-full w-full' />
        </div>
      </div>
    </div>
  )
}
