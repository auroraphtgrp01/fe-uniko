import { FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'

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
      <DialogContent className={className ?? 'sm:max-w-[425px]'}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog
