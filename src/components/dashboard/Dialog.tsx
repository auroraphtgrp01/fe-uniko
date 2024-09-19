import { FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

interface TransactionDialogProps {
  isOpen: boolean
  onClose: () => void
  title: any
  content: any
  className?: string
  description?: any
  footer?: any
}

const CustomDialog: FC<TransactionDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  content,
  className,
  footer
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`rounded-none p-0 sm:max-w-[100vw] md:max-w-[80vw] lg:max-w-[70vw] ${className}`}>
        <Card className='overflow-hidden rounded-none sm:rounded-lg'>
          <DialogHeader className='mt-8 flex flex-col items-center justify-between px-6 lg:flex-row'>
            <DialogTitle className='text-nowrap text-lg font-semibold sm:text-xl'>{title}</DialogTitle>
            <DialogDescription className='mt-1 text-nowrap text-sm text-muted-foreground'></DialogDescription>
            {description}
          </DialogHeader>
          <CardContent className='max-h-[70vh] overflow-y-auto'>{content}</CardContent>
          {footer && <DialogFooter className='mr-[5%] items-end bg-muted/10'>{footer}</DialogFooter>}
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog
