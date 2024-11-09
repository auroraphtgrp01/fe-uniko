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
import { ChevronDown, ChevronLeft, ChevronRight, Trash2Icon } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { IDataTableConfig } from '@/types/common.i'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { useTranslation } from 'react-i18next'
import EmptyBox from '@/images/empty-box.png'
import { Atom } from 'react-loading-indicators'
import Image from 'next/image'
import DeleteDialog, { IDeleteDialogProps } from './DeleteDialog'

export interface IDeleteProps extends IDeleteDialogProps {
  onOpen: (rowData?: any) => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  config: IDataTableConfig
  setConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  getRowClassName?: (row: TData) => string
  onRowClick?: (row: TData) => void
  onRowDoubleClick?: (row: TData) => void
  isLoading?: boolean
  buttons?: IButtonInDataTableHeader[]
  buttonInContextMenu?: IButtonInDataTableHeader[]
  onOpenDeleteAll?: (ids: string[]) => void
  onOpenDelete?: (id: string) => void
  deleteProps?: IDeleteProps
}

export function DataTable<TData, TValue>({
  columns,
  data,
  config,
  setConfig,
  getRowClassName,
  onRowClick,
  onRowDoubleClick,
  buttonInContextMenu,
  isLoading,
  buttons,
  onOpenDeleteAll,
  onOpenDelete,
  deleteProps
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation(['common'])
  const { currentPage, limit, totalPage, selectedTypes, types, isPaginate, isVisibleSortType, classNameOfScroll } =
    config
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [hoveredRow, setHoveredRow] = React.useState<number | null>(null)

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

  useEffect(() => {
    table.toggleAllPageRowsSelected(false)
    table.setPagination({ pageIndex: currentPage - 1, pageSize: limit })
  }, [data, config])

  const toggleType = (type: string) => {
    if (selectedTypes) {
      setConfig((prev) => ({
        ...prev,
        selectedTypes: selectedTypes.includes(type)
          ? selectedTypes.filter((selectedType) => selectedType !== type)
          : [...selectedTypes, type]
      }))
    }
  }

  return (
    <div className='h-full w-full p-1'>
      <div className='flex items-center justify-between py-4'>
        <div className='flex items-center space-x-2'>
          <div className='min-w-0'>
            <Input
              placeholder={t('table.filterPlaceholder')}
              defaultValue={''}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value)
              }}
              className='w-[200px]'
            />
          </div>
          {isVisibleSortType && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='whitespace-nowrap'>
                  {t('table.typesLabel')}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='w-[200px]'>
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
                  <DropdownMenuCheckboxItem disabled>{t('dropdown.noTypesAvailable')}</DropdownMenuCheckboxItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className='flex items-center space-x-2'>
          {onOpenDeleteAll && Object.values(table.getSelectedRowModel().rowsById).length > 0 && (
            <Button
              variant='default'
              size='icon'
              onClick={(e) => {
                e.preventDefault()
                onOpenDeleteAll(
                  Object.values(table.getSelectedRowModel().rowsById).map((item) => (item.original as any).id)
                )
                // deleteAllProps?.onOpen()
              }}
            >
              <Trash2Icon className='h-5 w-5' />
            </Button>
          )}
          {table.getRowModel().rows?.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='whitespace-nowrap'>
                  {t('table.columnsLabel')}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide() && column.id !== 'id' && column.id !== 'checkType')
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
          )}
          {buttons && buttons.length > 0
            ? buttons.map((button: IButtonInDataTableHeader) => (
                <Button
                  disabled={button.disabled}
                  key={button.title}
                  variant={button.variants ? button.variants : 'default'}
                  className='whitespace-nowrap'
                  onClick={() => button.onClick()}
                >
                  {button.title} {button.icon}
                </Button>
              ))
            : ''}
        </div>
      </div>
      <div className='rounded-md border'>
        <Table classNameOfScroll={classNameOfScroll}>
          <TableHeader style={{ cursor: data?.length ? 'pointer' : 'default' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={`text-nowrap ${!data?.length ? 'pointer-events-none' : ''}`}
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
                {onOpenDelete && (
                  <TableHead
                    className={`text-nowrap ${!data?.length ? 'pointer-events-none' : ''}`}
                    key={'deleteIcon'}
                    onMouseDown={(event) => {
                      if (event.detail > 1) {
                        event.preventDefault()
                      }
                    }}
                  />
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!data?.length ? (
              <TableRow className='hover:bg-transparent'>
                <TableCell colSpan={columns.length + (onOpenDelete ? 1 : 0)} className='h-24 text-center'>
                  {isLoading ? (
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <Atom color='#be123c' size='small' textColor='#be123c' />
                      <span className='font-semibold'>Loading</span>
                    </div>
                  ) : (
                    <div className='flex select-none flex-col items-center justify-center gap-2'>
                      <Image priority src={EmptyBox} alt='' height={50} width={50} />
                      <span className='font-semibold text-foreground'>{t('table.noDataText')}</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  className={getRowClassName ? getRowClassName(row.original) : ''}
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={(event: any) => {
                    if (
                      (event.target.getAttribute('role') === null ||
                        event.target.getAttribute('role') !== 'checkbox') &&
                      onRowClick
                    ) {
                      onRowClick(row.original)
                    }
                  }}
                  onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                  {onOpenDelete && (
                    <TableCell className='w-[50px] p-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={(e) => {
                          e.stopPropagation()
                          onOpenDelete((row.original as any).id)
                        }}
                        className={`h-8 w-8 transition-opacity duration-200 ${
                          hoveredRow === index ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <Trash2Icon className='h-4 w-4 text-red-600 dark:text-red-400' />
                        <span className='sr-only'>Delete row</span>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className='flex flex-col items-center justify-between space-y-4 px-3 py-2 sm:flex-row sm:space-y-0'>
          <p className='text-xs text-gray-500 sm:text-sm'>
            {t('table.selectedRowsText', {
              selected: table.getFilteredSelectedRowModel().rows.length,
              total: table.getFilteredRowModel().rows.length
            })}
          </p>
          {isPaginate ? (
            <div className='flex flex-col items-center sm:flex-row sm:items-center sm:space-x-4'>
              <div className='flex flex-col items-center sm:flex-row sm:space-x-4'>
                <div className='flex items-center space-x-2'>
                  <p className='whitespace-nowrap text-sm'>{t('table.rowsPerPageLabel')}</p>
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
                    {t('table.pageOf', {
                      currentPage,
                      totalPage
                    })}
                  </p>
                  <div className='flex space-x-1'>
                    <Button
                      className='px-2'
                      variant='outline'
                      size='sm'
                      onClick={() => {
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
                        setConfig((prev) => ({
                          ...prev,
                          currentPage: currentPage + 1
                        }))
                      }}
                      disabled={currentPage === totalPage || totalPage === 0}
                    >
                      <ChevronRight size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {deleteProps && <DeleteDialog {...deleteProps} />}
      </div>
    </div>
  )
}
