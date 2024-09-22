import { FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { IDialogConfig } from '@/types/common.i'
interface CustomDialogProps {
  config: IDialogConfig
}

const CustomDialog: FC<CustomDialogProps> = ({ config }) => {
  let { isOpen } = config
  const { title, description, content, className, footer, onClose } = config
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
