'use client'

import { ColumnDef } from '@tanstack/react-table'
import { convertToCamelCase } from '@/libraries/utils'
import { ArrowUpDown } from 'lucide-react'
import { renderToString } from 'react-dom/server'
import parse from 'html-react-parser'
import { Button } from '../ui/button'
import { IDeleteProps } from './DataTable'

export function getColumns<T>({
  headers,
  isSort,
  deleteAllProps
}: {
  headers: string[]
  isSort: boolean
  deleteAllProps?: {
    onOpen: (rowData?: any) => void
  }
}): ColumnDef<T>[] {
  console.log('>>>>>>', headers)

  const columnsFromHeaders = headers.map((header) => ({
    accessorKey: `${convertToCamelCase(header)}`,
    header: ({ column }: { column: any }) =>
      header === 'Id' || header === 'Check Type' ? (
        ''
      ) : isSort ? (
        <div
          className='flex'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          {header}
          <ArrowUpDown className='ml-2 mt-1 h-3 w-3' />
        </div>
      ) : (
        <div>{header}</div>
      ),
    cell: ({ row }: { row: any }) => {
      return header === 'Id' || header === 'Check Type' ? (
        ''
      ) : (
        <div>{parse(renderToString(row.getValue(convertToCamelCase(header))))}</div>
      )
    }
  }))

  const defaultColumn = [
    {
      accessorKey: 'inProgress',
      header: ({ table }: { table: any }) => (
        <Button
          className='w-13 text-center text-red-600'
          variant='ghost'
          size='icon'
          onClick={(e) => {
            e.preventDefault()
            deleteAllProps?.onOpen()
          }}
        >
          Delete all
        </Button>
      ),
      cell: ({ row }: { row: any }) => <span className='text-center'>{row.index + 1}</span>,
      enableSorting: false,
      enableHiding: false
    }
  ]

  return [...defaultColumn, ...columnsFromHeaders]
}
