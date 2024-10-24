import { FC, FormEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { IDialogConfig } from '@/types/common.i'
import { DialogOverlay } from '@radix-ui/react-dialog'
interface CustomDialogProps {
  config: IDialogConfig
  onSubmit?: (e: FormEvent) => void
}

const CustomDialog: FC<CustomDialogProps> = ({ config, onSubmit }) => {
  let { isOpen } = config
  const { title, description, content, className, footer, onClose } = config
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={className ?? 'sm:max-w-[425px]'}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {content}
          <DialogFooter>{footer}</DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog
