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
import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, PlusIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { IDataTableConfig } from '@/types/common.i'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  config: IDataTableConfig
  setConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  onCreateButtonClick?: () => void
  getRowClassName?: (row: TData) => string
  onRowClick?: (row: TData) => void
  onRowDoubleClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  config,
  setConfig,
  onCreateButtonClick,
  getRowClassName,
  onRowClick,
  onRowDoubleClick
}: DataTableProps<TData, TValue>) {
  const { currentPage, limit, totalPage, selectedTypes, types, isPaginate, isVisibleSortType, classNameOfScroll } =
    config
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

  const toggleType = (type: string) => {
    if (selectedTypes)
      setConfig((prev) => ({
        ...prev,
        selectedTypes: selectedTypes.includes(type)
          ? selectedTypes.filter((selectedType) => selectedType !== type)
          : [...selectedTypes, type]
      }))
  }

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <div className='min-w-0 max-w-md'>
          <Input
            placeholder='Filter'
            defaultValue={''}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value)
            }}
            className='w-60'
          />
        </div>
        {isVisibleSortType && (
          <div className='flex-1'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='whitespace-nowrap'>
                  <span className='mr-2 hidden sm:inline-block'>Types</span>
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                {types && types.length > 0 ? (
                  types.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      className='capitalize'
                      checked={selectedTypes ? selectedTypes.includes(type) : false}
                      onCheckedChange={() => toggleType(type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))
                ) : (
                  <DropdownMenuCheckboxItem disabled>No Types Available</DropdownMenuCheckboxItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div className='flex items-center space-x-2'>
          {onCreateButtonClick && (
            <Button variant='outline' className='whitespace-nowrap' onClick={onCreateButtonClick}>
              <span className='mr-2 hidden sm:inline-block'>Create</span>
              <PlusIcon className='h-4 w-4' />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='whitespace-nowrap'>
                <span className='mr-2 hidden sm:inline-block'>Columns</span>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px]'>
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
      </div>
      <div className='rounded-md border'>
        <Table classNameOfScroll={classNameOfScroll}>
          <TableHeader style={{ cursor: 'pointer' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className='text-nowrap'
                      key={header.id}
                      onMouseDown={(event) => {
                        if (event.detail > 1) {
                          event.preventDefault()
                        }
                      }}
                    >
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
                    style={{ cursor: 'pointer' }}
                    className={getRowClassName ? getRowClassName(row.original) : ''}
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={(event: any) => {
                      console.log(onRowClick)

                      console.log(
                        event.currentTarget.getAttribute('role') === null ||
                          event.currentTarget.getAttribute('role') !== 'checkbox'
                      )

                      if (
                        (event.currentTarget.getAttribute('role') === null ||
                          event.currentTarget.getAttribute('role') !== 'checkbox') &&
                        onRowClick
                      ) {
                        console.log('onRowClick')

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
          </TableBody>
        </Table>

        <div className='flex flex-col items-center justify-between space-y-4 px-3 py-2 sm:flex-row sm:space-y-0'>
          <p className='text-xs text-gray-500 sm:text-sm'>
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </p>
          {isPaginate ? (
            <div className='flex flex-col items-center sm:flex-row sm:items-center sm:space-x-4'>
              <div className='flex flex-col items-center sm:flex-row sm:space-x-4'>
                <div className='flex items-center space-x-2'>
                  <p className='whitespace-nowrap text-sm'>Rows per page</p>
                  <Input
                    defaultValue={limit}
                    onChange={(event) =>
                      setConfig((prev) => ({
                        ...prev,
                        limit: Number(event.target.value)
                      }))
                    }
                    className='w-12 px-1 pl-3 text-center'
                    type='number'
                    min={1}
                    max={20}
                    inputMode='numeric'
                    pattern='[0-9]*'
                  />
                </div>
                <div className='flex items-center space-x-2'>
                  <p className='whitespace-nowrap text-sm'>
                    Page {currentPage} of {totalPage}
                  </p>
                  <div className='flex space-x-1'>
                    <Button
                      className='px-2'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        table.previousPage()
                        setConfig((prev) => ({
                          ...prev,
                          currentPage: currentPage - 1
                        }))
                      }}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={15} />
                    </Button>
                    <Button
                      className='px-2'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        table.nextPage()
                        setConfig((prev) => ({
                          ...prev,
                          currentPage: currentPage + 1
                        }))
                      }}
                      disabled={currentPage === totalPage}
                    >
                      <ChevronRight size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
