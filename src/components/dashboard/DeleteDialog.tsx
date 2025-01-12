'use client'

import { Trash2, AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { translate } from '@/libraries/utils'

export interface IDeleteDialogProps {
  customTitle?: string
  customDescription?: string
  onDelete: () => void
  isDialogOpen: boolean
  onClose: () => void
}
const t = translate(['common'])

export default function DeleteDialog({
  onDelete,
  isDialogOpen,
  onClose,
  customTitle = t('deleteDialog.deleteConfirmation'),
  customDescription = t('deleteDialog.description')
}: IDeleteDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent className='overflow-hidden p-0 sm:max-w-[425px]'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold text-rose-600'>
            <Trash2 className='h-6 w-6' />
            {customTitle}
          </DialogTitle>
          <DialogDescription className='text-rose-600'>{customDescription}</DialogDescription>
        </DialogHeader>
        <div className='p-6'>
          <div className='rounded-r-md border-l-4 border-rose-600 p-2'>
            <div className='flex items-start'>
              <AlertTriangle className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-600' />
              <p className='text-sm text-rose-600 dark:text-rose-500'>
                <span className='font-semibold text-rose-600'>{t('deleteDialog.note')}</span> {t('deleteDialog.info')}
              </p>
            </div>
          </div>
          <div className='mt-6 flex justify-end gap-3'>
            <Button variant='outline' onClick={onClose}>
              {t('button.cancel')}
            </Button>
            <Button
              variant='default'
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className='relative overflow-hidden'
            >
              <span className='relative z-10'>{t('button.delete')}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
