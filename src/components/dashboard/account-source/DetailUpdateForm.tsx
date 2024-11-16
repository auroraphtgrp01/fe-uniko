import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-select'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { IAccountSourceDataFormat, IDialogAccountSource } from '@/core/account-source/models'

export default function DetailUpdateAccountSourceForm({
  setIsDialogOpen,
  dataDetail
}: {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  dataDetail: IAccountSourceDataFormat
}) {
  return (
    <div className='py-4'>
      <div className='mb-6'>
        <div className='mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div className='mb-2 w-full sm:mb-0'>
            <p className='text-sm text-muted-foreground'>Current Amount</p>
            <div className='flex w-full items-center justify-between'>
              <p className='text-2xl font-bold'>{dataDetail.currentAmount}</p>
              <Button
                variant={'destructive'}
                type='button'
                onClick={() => {
                  setIsDialogOpen((prev) => ({
                    ...prev,
                    isDialogUpdateOpen: true
                  }))
                }}
              >
                Edit Account Source
              </Button>
            </div>
          </div>
        </div>

        <Separator className='my-4' />
      </div>

      <div className='overflow-x-auto'>
        <Table className='w-full'>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium text-muted-foreground'>Account Bank</TableCell>
              <TableCell>{dataDetail.accountBank}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium text-muted-foreground'>Check Type</TableCell>
              <TableCell>{dataDetail.checkType}</TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell className='font-medium text-muted-foreground'>Currency</TableCell>
              <TableCell>{dataDetail.currency}</TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell className='font-medium text-muted-foreground'>Initial Amount</TableCell>
              <TableCell>{dataDetail.initAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium text-muted-foreground'>Name</TableCell>
              <TableCell>{dataDetail.name}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
