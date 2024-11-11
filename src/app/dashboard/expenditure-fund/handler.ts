import {
  ICreateExpenditureFundBody,
  IExpenditureFundDialogOpen
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import toast from 'react-hot-toast'

export interface IHandleCreateExpenditureFundProps {
  data: ICreateExpenditureFundBody
  hookCreate: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IExpenditureFundDialogOpen>>
}

export const handleCreateExpenditureFund = async ({
  data,
  hookCreate,
  setIsDialogOpen
}: IHandleCreateExpenditureFundProps) => {
  hookCreate(data, {
    onSuccess: (res: any) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
        toast.success('Create expenditure fund successfully!')
      }
    }
  })
}
