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
      <DialogContent className={className ?? 'sm:max-w-[425px]'}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent>{content}</CardContent>
        </Card>
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog
