import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-select'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export default function DetailUpdateAccountSourceForm({
    detailUpdateAccountSource
}: {
    detailUpdateAccountSource: any
}) {
    const { detailAccountSourceDialog, sharedDialogElements } = detailUpdateAccountSource

    return (
        <div className='py-4'>
            <div className='mb-6'>
                <div className='mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                    <div className='mb-2 w-full sm:mb-0'>
                        <p className='text-sm text-muted-foreground'>Current Amount</p>
                        <div className='flex w-full items-center justify-between'>
                            <p className='text-2xl font-bold'>{detailAccountSourceDialog.dataDetail.currentAmount}</p>
                            <Button
                                variant={'destructive'}
                                type='button'
                                onClick={() => {
                                    sharedDialogElements.setIsDialogOpen((prev: { isDialogUpdateOpen: boolean }) => ({
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
                            <TableCell>{detailAccountSourceDialog.dataDetail.accountBank}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='font-medium text-muted-foreground'>Check Type</TableCell>
                            <TableCell>{detailAccountSourceDialog.dataDetail.checkType}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='font-medium text-muted-foreground'>Currency</TableCell>
                            <TableCell>{detailAccountSourceDialog.dataDetail.data.currency}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='font-medium text-muted-foreground'>Initial Amount</TableCell>
                            <TableCell>{detailAccountSourceDialog.dataDetail.initAmount}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='font-medium text-muted-foreground'>Name</TableCell>
                            <TableCell>{detailAccountSourceDialog.dataDetail.name}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
