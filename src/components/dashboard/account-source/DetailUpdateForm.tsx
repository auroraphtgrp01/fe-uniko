import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-select'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency, translate } from '@/libraries/utils'
import { EAccountSourceType, IAccountSource } from '@/core/account-source/models'

export default function DetailUpdateAccountSourceForm({
  detailAccountSource,
  sharedDialogElements
}: {
  detailAccountSource: IAccountSource
  sharedDialogElements: any
}) {
  const t = translate(['accountSource', 'common'])
  return (
    <div className='py-4'>
      <div className='mb-6'>
        <div className='mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div className='mb-2 w-full sm:mb-0'>
            <p className='text-sm text-muted-foreground'>{t('form.editAccountSource.currentAmount')}</p>
            <div className='flex w-full items-center justify-between'>
              <p className='text-2xl font-bold'>
                {formatCurrency(detailAccountSource.currentAmount ?? 0, 'đ', 'vi-vn')}
              </p>
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
                {t('form.button.edit_account_source')}
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
              <TableCell className='font-medium text-muted-foreground'>
                {t('form.editAccountSource.accountBank')}
              </TableCell>
              <TableCell>
                {detailAccountSource.accountBank && detailAccountSource.accountBank.accounts.length > 0
                  ? detailAccountSource.accountBank.accounts.map((account) => account.accountNo).join(',\n') || ''
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium text-muted-foreground'>{t('form.editAccountSource.type')}</TableCell>
              <TableCell>
                {detailAccountSource.type === EAccountSourceType.WALLET ? t('type.WALLET') : t('type.BANKING')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium text-muted-foreground'>
                {t('form.editAccountSource.currency')}
              </TableCell>
              <TableCell>{detailAccountSource.currency}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium text-muted-foreground'>
                {t('form.editAccountSource.initialAmount')}
              </TableCell>
              <TableCell>{formatCurrency(detailAccountSource.initAmount ?? 0, 'đ', 'vi-vn')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium text-muted-foreground'>{t('form.editAccountSource.name')}</TableCell>
              <TableCell>{detailAccountSource.name}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
