import { formatData } from '@/app/dashboard/account-source/constants'
import { IAccountSourceDialogFlag } from '@/hooks/core/account-source/models'
import { IAccountSourceBody, IAccountSourceDataFormat } from '@/types/account-source.i'
import toast from 'react-hot-toast'
export const handleShowDetailAccountSource = async (
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IAccountSourceDialogFlag>>,
  getAccountSourceById: any
) => {
  const data = getAccountSourceById.data
  setFormData({
    id: data.id,
    name: data.name as string,
    type: data.type,
    initAmount: Number(data.initAmount),
    currency: data.currency
  })
  setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: true }))
}

export const handleCreateAccountSource = async ({
  formData,
  setIsDialogOpen,
  setData,
  setTableData,
  setFormData,
  data,
  tableData,
  createAccountSource
}: {
  formData: IAccountSourceBody
  setIsDialogOpen: React.Dispatch<
    React.SetStateAction<{
      isDialogCreateOpen: boolean
      isDialogUpdateOpen: boolean
      isCloseConfirmationDialog: boolean
    }>
  >
  createAccountSource: any // You can type this properly based on the actual function or API you're using.
  updateAccountSource?: any // Optional, if you're using it later
  setData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>
  data: IAccountSourceDataFormat[]
  setTableData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>
  tableData: IAccountSourceDataFormat[]
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
}) => {
  const payload: IAccountSourceBody = {
    name: formData.name,
    type: formData.type,
    initAmount: formData.initAmount,
    currency: formData.currency
  }
  createAccountSource(payload, {
    onSuccess: (res: any) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        const format = formatData(res.data)
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
        setData([format, ...data])
        setTableData([format, ...tableData])
        setFormData((prev) => ({ ...prev, name: '', type: '', initAmount: 0, currency: '' }))
        toast.success('Create account source successfully!')
      }
    }
  })
}

export const handleUpdateAccountSource = async ({
  formData,
  setIsDialogOpen,
  setData,
  setTableData,
  setFormData,
  updateAccountSource
}: {
  formData: IAccountSourceBody
  setIsDialogOpen: React.Dispatch<
    React.SetStateAction<{
      isDialogCreateOpen: boolean
      isDialogUpdateOpen: boolean
      isCloseConfirmationDialog: boolean
    }>
  >
  updateAccountSource: any
  setData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>
  setTableData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
}) => {
  const payload: IAccountSourceBody = {
    name: formData.name,
    type: formData.type,
    initAmount: formData.initAmount,
    currency: formData.currency,
    id: formData.id
  }
  updateAccountSource(payload, {
    onSuccess(res: any) {
      if (res.statusCode === 200 || res.statusCode === 201) {
        const format = formatData(res.data)
        setData((prevRows) => prevRows.map((row) => (row.id === format.id ? { ...row, ...format } : row)))
        setTableData((prevRows) => prevRows.map((row) => (row.id === format.id ? { ...row, ...format } : row)))
        setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
        setFormData((prev) => ({ ...prev, name: '', type: '', initAmount: 0, currency: '' }))
        toast.success('Update account source successfully!')
      }
    }
  })
}
