'use client'

import { ColumnDef } from '@tanstack/react-table'
import { convertToCamelCase } from '@/libraries/utils'
import { ArrowUpDown } from 'lucide-react'
import { renderToString } from 'react-dom/server'
import parse from 'html-react-parser'
import { Checkbox } from '../ui/checkbox'

export function getColumns<T>({ headers, isSort }: { headers: string[]; isSort: boolean }): ColumnDef<T>[] {
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
      header: ({ table }: { table: any }) => {
        return (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
          />
        )
      },
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false
    }
  ]

  return [...defaultColumn, ...columnsFromHeaders]
}
