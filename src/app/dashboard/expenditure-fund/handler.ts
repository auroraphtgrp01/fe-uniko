import {
  IAdvancedExpenditureFundResponse,
  ICreateExpenditureFundBody,
  IExpenditureFund,
  IExpenditureFundDataFormat,
  IExpenditureFundDialogOpen,
  IHandleCreateExpenditureFundProps,
  IHandleUpdateExpenditureFundProps
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { formatArrayData, getTypes } from '@/libraries/utils'
import { IDataTableConfig } from '@/types/common.i'
import toast from 'react-hot-toast'
import { formatExpenditureFundData } from './constants'

interface ICallBackRefetchAPIProps {
  refetchAdvancedExpendingFund: any
}

export const callBackRefetchAPI = async ({ refetchAdvancedExpendingFund }: ICallBackRefetchAPIProps) => {
  refetchAdvancedExpendingFund()
}

export const handleCreateExpenditureFund = async ({
  data,
  hookCreate,
  setIsDialogOpen,
  callBackRefetchAPI
}: IHandleCreateExpenditureFundProps) => {
  hookCreate(data, {
    onSuccess: (res: any) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
        toast.success('Create expenditure fund successfully!')
        callBackRefetchAPI()
      }
    }
  })
}

export const handleUpdateExpenditureFund = async ({
  data,
  hookUpdate,
  setIsDialogOpen,
  callBackRefetchAPI
}: IHandleUpdateExpenditureFundProps) => {
  hookUpdate(data, {
    onSuccess: (res: any) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
        toast.success('Update expenditure fund successfully!')
        callBackRefetchAPI()
      }
    }
  })
}

export const initExpenditureFundDataTable = (
  isGetAdvancedPending: boolean,
  getAdvancedData: IAdvancedExpenditureFundResponse | undefined,
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>,
  setTableData: React.Dispatch<React.SetStateAction<IExpenditureFundDataFormat[]>>
) => {
  if (!isGetAdvancedPending && getAdvancedData) {
    const formattedData: IExpenditureFundDataFormat[] = formatArrayData(getAdvancedData.data, formatExpenditureFundData)

    setDataTableConfig((prev) => ({
      ...prev,
      totalPage: Number(getAdvancedData.pagination?.totalPage)
    }))
    setTableData(formattedData)
  }
}
