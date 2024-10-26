'use client'
import React from 'react'
import CardInHeader from '@/components/dashboard/CardInHeader'
import { DateTimePicker } from '../../components/core/DateTimePicker'
import { DateRangePicker } from '../../components/core/DateRangePicker'
import { Combobox } from '../../components/core/Combobox'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import FormZod from '@/components/core/FormZod'
import { formBody, registerSchema } from '@/types/formZod.interface'

export default function DashboardMainForm() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='flex w-full flex-col md:col-span-1'>
        <div className='grid flex-1 grid-cols-1 gap-4'>
          {/* <Combobox
            onValueSelect={(newValue) => {}}
            setOpenEditDialog={setOpenEditDialog}
            dataArr={data}
            dialogEdit={EditTrackerTypeDialog({
              openEditDialog: openEditDialog,
              setOpenEditDialog: setOpenEditDialog,
              dataArr: []
            })}
            label='Tracker Transaction Type'
          /> */}
          <FormZod
            formSchema={registerSchema}
            onSubmit={(values: any) => {
              console.log('hello', values)
            }}
            formFieldBody={formBody}
          />
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
