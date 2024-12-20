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
import React, { useEffect } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  Trash2Icon
} from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { IDataTableConfig } from '@/types/common.i'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { useTranslation } from 'react-i18next'
import EmptyBox from '@/images/empty-box.png'
import { Atom } from 'react-loading-indicators'
import Image from 'next/image'
import DeleteDialog, { IDeleteDialogProps } from './DeleteDialog'
import { motion } from 'framer-motion'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

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
  extendsJSX?: JSX.Element
}

const tableRowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.015,
      duration: 0.15,
      ease: 'easeOut'
    }
  })
}

export const emptyStateVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
}

export const emptyStateItemVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2
    }
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  config,
  setConfig,
  getRowClassName,
  onRowClick,
  onRowDoubleClick,
  isLoading,
  buttons,
  onOpenDeleteAll,
  onOpenDelete,
  deleteProps,
  extendsJSX
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
    <div className='flex h-full flex-col overflow-hidden p-1'>
      <div className='flex flex-col items-center justify-between gap-4 py-4 md:flex-row'>
        <div className='flex w-full items-center space-x-2 md:w-auto'>
          <div className='min-w-0 flex-1 md:flex-none'>
            <Input
              placeholder={t('table.filterPlaceholder')}
              defaultValue={''}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value)
              }}
              className='w-full md:w-[200px]'
            />
          </div>
          {isVisibleSortType && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='whitespace-nowrap'>
                  <span className='text-sm'>{t('table.typesLabel')}</span>
                  <ChevronDown className='ml-2 h-3 w-3' />
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
        <div className='flex w-full items-center justify-end space-x-2 md:w-auto'>
          {onOpenDeleteAll && Object.values(table.getSelectedRowModel().rowsById).length > 0 && (
            <Button
              variant='default'
              size='icon'
              onClick={(e) => {
                e.preventDefault()
                onOpenDeleteAll(
                  Object.values(table.getSelectedRowModel().rowsById).map((item) => (item.original as any).id)
                )
              }}
            >
              <Trash2Icon className='h-5 w-5' />
            </Button>
          )}
          {extendsJSX}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='whitespace-nowrap'>
                {t('button.view')} <Settings2 className='ml-2 h-4 w-4' />
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
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide() && column.id !== 'id' && column.id !== 'checkType').length ===
                0 && (
                <div className='flex items-center justify-center p-4'>
                  <div className='text-center'>
                    <Image priority src={EmptyBox} alt='' height={30} width={30} className='mx-auto' />
                    <span className='mt-2 block text-sm font-semibold text-foreground'>{t('table.noDataText')}</span>
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
          {}
        </div>
      </div>
      <div className='flex flex-1 flex-col overflow-hidden rounded-md border'>
        <div className='flex-1 overflow-hidden' style={{ height: classNameOfScroll }}>
          <Table classNameOfScroll={classNameOfScroll}>
            <TableHeader style={{ cursor: data?.length ? 'pointer' : 'default' }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    const isFirstColumn = index === 0
                    const isLastColumn = index === headerGroup.headers.length - 1

                    return (
                      <TableHead
                        className={`h-full items-center text-nowrap ${!data?.length ? 'pointer-events-none' : ''} ${
                          !isFirstColumn && !isLastColumn ? 'text-center' : ''
                        } ${isFirstColumn ? 'text-left' : ''} ${isLastColumn ? 'text-right' : ''}`}
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
                      <motion.div
                        initial='hidden'
                        animate='visible'
                        variants={emptyStateVariants}
                        className='flex flex-col items-center justify-center gap-2'
                      >
                        <motion.div variants={emptyStateItemVariants}>
                          <Atom color='#be123c' size='small' textColor='#be123c' />
                        </motion.div>
                        <motion.span variants={emptyStateItemVariants} className='font-semibold'>
                          Loading
                        </motion.span>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial='hidden'
                        animate='visible'
                        variants={emptyStateVariants}
                        className='mt-20 flex select-none flex-col items-center justify-center gap-2'
                      >
                        <motion.div variants={emptyStateItemVariants}>
                          <Image priority src={EmptyBox} alt='' height={50} width={50} />
                        </motion.div>
                        <motion.span variants={emptyStateItemVariants} className='font-semibold text-foreground'>
                          {t('table.noDataText')}
                        </motion.span>
                      </motion.div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    initial='hidden'
                    animate='visible'
                    custom={index}
                    variants={tableRowVariants}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    className={`${getRowClassName ? getRowClassName(row.original) : ''} border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted`}
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
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex flex-col items-center justify-between space-y-4 border-t px-3 py-2 md:grid md:grid-cols-[repeat(auto-fit,minmax(10px,1fr))] md:gap-4 md:space-y-0'>
          <p className='text-xs text-gray-500 max-md:mt-2 sm:text-sm'>
            {t('table.selectedRowsText', {
              selected: table?.getFilteredSelectedRowModel().rows.length,
              total: table.getFilteredRowModel().rows.length
            })}
          </p>
          {isPaginate && (
            <div className='flex select-none flex-col items-center md:flex-row md:items-center md:justify-end md:space-x-4'>
              <div className='flex flex-col items-center md:flex-row md:space-x-4'>
                <div className='flex items-center space-x-2'>
                  <p className='whitespace-nowrap text-sm'>{t('table.rowsPerPageLabel')}</p>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) =>
                      setConfig((prev) => ({
                        ...prev,
                        limit: Number(value)
                      }))
                    }
                  >
                    <SelectTrigger className='w-14 px-2 text-center'>
                      <SelectValue placeholder='Select rows per page' />
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                      <SelectItem value='5'>5</SelectItem>
                      <SelectItem value='10'>10</SelectItem>
                      <SelectItem value='15'>15</SelectItem>
                      <SelectItem value='20'>20</SelectItem>
                      <SelectItem value='25'>25</SelectItem>
                      <SelectItem value='30'>30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center space-x-2'>
                  <p className='whitespace-nowrap text-sm'>
                    {t('table.pageOf', {
                      currentPage,
                      totalPage
                    })}
                  </p>
                  <div className='flex space-x-1 max-md:py-2'>
                    <Button
                      className='px-2'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setConfig((prev) => ({
                          ...prev,
                          currentPage: 1
                        }))
                      }}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft size={15} />
                    </Button>
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
                    <Button
                      className='px-2'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setConfig((prev) => ({
                          ...prev,
                          currentPage: totalPage
                        }))
                      }}
                      disabled={currentPage === totalPage || totalPage === 0}
                    >
                      <ChevronsRight size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {deleteProps && <DeleteDialog {...deleteProps} />}
      </div>
    </div>
  )
}
