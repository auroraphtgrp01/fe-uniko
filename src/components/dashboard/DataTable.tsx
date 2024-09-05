'use client'

import {
  ColumnDef,
  SortingState,
  flexRender,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  useReactTable
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, PlusIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Input } from '../ui/input'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isPaginate: boolean
  createFunction?: () => void
  // eslint-disable-next-line no-unused-vars
  getRowClassName?: (row: TData) => string
  // eslint-disable-next-line no-unused-vars
  onRowClick?: (row: TData) => void
  // eslint-disable-next-line no-unused-vars
  onRowDoubleClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isPaginate,
  createFunction,
  getRowClassName,
  onRowClick,
  onRowDoubleClick
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder='Filter emails...'
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    className={getRowClassName ? getRowClassName(row.original) : ''}
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={(event: any) => {
                      console.log()

                      if (event.target.role !== 'checkbox' && onRowClick) {
                        onRowClick(row.original)
                      }
                    }}
                    onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
            {createFunction ? (
              <TableRow>
                <TableCell colSpan={100} onClick={() => createFunction()}>
                  <button className='flex items-center text-gray-400 hover:text-gray-200'>
                    <PlusIcon className='mr-2 h-4 w-4' />
                    Create new...
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              ''
            )}
          </TableBody>
        </Table>

        <div className='flex flex-col items-center justify-between space-y-2 px-3 py-1 sm:flex-row sm:space-x-2 sm:space-y-0'>
          <p className='text-xs text-gray-500 sm:text-sm'>
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </p>
          {isPaginate ? (
            <div className='flex w-full items-center justify-end space-x-2 py-2 sm:w-auto sm:py-4'>
              <p className='text-sm'>Rows per page</p>
              <Button variant='outline' className='border-gray-300 px-2 text-xs sm:text-sm'>
                10 <ChevronsUpDown size={15} className='ml-1 text-gray-600 sm:ml-2' />
              </Button>
              <p className='text-sm'>Page 1 of 10</p>
              <Button className='ml-1 sm:ml-5' variant='outline' size='sm' onClick={() => table.previousPage()}>
                <ChevronLeft size={15} />
              </Button>
              <Button variant='outline' size='sm' onClick={() => table.nextPage()}>
                <ChevronRight size={15} />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
