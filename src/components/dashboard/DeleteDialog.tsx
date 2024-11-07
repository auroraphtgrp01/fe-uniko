import { IDialogConfig } from '@/types/common.i'
import { Button } from '../ui/button'
import CustomDialog from './Dialog'
import { t } from 'i18next'
import { AlertTriangle } from 'lucide-react'

export interface IDeleteDialogProps {
  customTitle?: string
  customDescription?: string
  onDelete: () => void
  isDialogOpen: boolean
  onClose: () => void
}

export default function DeleteDialog({
  onDelete,
  isDialogOpen,
  onClose,
  customTitle,
  customDescription
}: IDeleteDialogProps) {
  const deleteConfigDialog: IDialogConfig = {
    content: (
      <div className='my-4 border-l-4 border-yellow-400 bg-yellow-50 p-4'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <AlertTriangle className='h-5 w-5 text-yellow-400' />
          </div>
          <div className='ml-3'>
            <p className='text-sm text-yellow-700'>
              <span className='font-medium'>Lưu ý:</span> Dữ liệu khi đã được xóa sẽ không thể khôi phục trở lại!
            </p>
          </div>
        </div>
      </div>
    ),
    footer: (
      <>
        <Button
          onClick={() => {
            onClose()
          }}
          type='button'
          variant={'blueVin'}
        >
          {t('common:button.cancel')}
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          type='button'
        >
          {t('common:button.delete')}
        </Button>
      </>
    ),
    className: 'sm:max-w-[425px] ',
    description: customDescription || 'Bạn chắc chắn muốn xóa dữ liệu này?',
    title: customTitle || 'Xác nhận xóa',
    isOpen: isDialogOpen,
    onClose: () => {
      onClose()
    }
  }
  return <CustomDialog config={deleteConfigDialog} />
}
