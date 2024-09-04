'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { convertToCamelCase, formatCurrencyVND, formatDateTimeVN, parseReactToHtml } from '@/constants/functions'

export function getColumns(headers: string[]): ColumnDef<any>[] {
  const columnsFromHeaders = headers.map((header) => ({
    accessorKey: `${convertToCamelCase(header)}`,
    header: () => (
      <div className='flex items-center'>
        <span>{header.toLocaleUpperCase()}</span>
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return <div className='font-medium'>{parseReactToHtml(row.getValue(convertToCamelCase(header)))}</div>
    }
  }))

  const defaultColumn = [
    {
      id: 'inProgress',
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false
    }
  ]

  return [...defaultColumn, ...columnsFromHeaders]
}

// export const columns: ColumnDef<any>[] = [
//   {
//     accessorKey: 'task',
//     header: 'TASK',
//     cell: ({ row }) => <div className='font-medium'>{row.getValue('task')}</div>
//   },
//   {
//     accessorKey: 'assignee',
//     header: 'ASSIGNEE',
//     cell: ({ row }) => {
//       const assignee = row.getValue('assignee') as { name: string; avatar: string }
//       return (
//         <div className='flex items-center'>
//           {/* <Avatar className='h-8 w-8'>
//             <AvatarImage src={assignee.avatar} alt={assignee.name} />
//             <AvatarFallback>{assignee.name[0]}</AvatarFallback>
//           </Avatar> */}
//           <span className='ml-2'>{assignee.name}</span>
//         </div>
//       )
//     }
//   },
//   {
//     accessorKey: 'type',
//     header: 'TYPE',
//     cell: ({ row }) => (
//       <div className='flex items-center'>
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           viewBox='0 0 24 24'
//           fill='none'
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'
//           className='mr-2 h-4 w-4'
//         >
//           <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
//         </svg>
//         {row.getValue('type')}
//       </div>
//     )
//   },
//   {
//     accessorKey: 'priority',
//     header: 'PRIORITY',
//     cell: ({ row }) => <span>hello</span>
//     // <Badge variant='destructive' className='bg-red-500'>
//     //   {row.getValue('priority')}
//     // </Badge>
//   },
//   {
//     accessorKey: 'point',
//     header: 'POINT',
//     cell: ({ row }) => (
//       <div className='flex items-center'>
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           viewBox='0 0 24 24'
//           fill='none'
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'
//           className='mr-2 h-4 w-4'
//         >
//           <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
//         </svg>
//         {row.getValue('point')}
//       </div>
//     )
//   },
//   {
//     accessorKey: 'dueDate',
//     header: 'DUE DATE',
//     cell: ({ row }) => <div className='text-muted-foreground'>{row.getValue('dueDate')}</div>
//   },
//   {
//     accessorKey: 'progress',
//     header: 'PROGRESS',
//     cell: ({ row }) => <span>say hi</span>
//     // <Progress value={row.getValue('progress')} className='w-[100px]' />
//   }
// ]
