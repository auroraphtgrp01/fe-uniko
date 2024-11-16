import { initEmptyDetailAccountSourceType } from '@/app/dashboard/account-source/constants'
import { handleCreateAccountSource, handleUpdateAccountSource } from '@/app/dashboard/account-source/handler'
import CreateAndUpdateAccountSourceForm from '@/components/dashboard/account-source/Create&UpdateForm'
import DetailUpdateAccountSourceForm from '@/components/dashboard/account-source/DetailUpdateForm'
import CustomDialog from '@/components/dashboard/Dialog'
import { IAccountSourceBody, IAccountSourceDataFormat, IDialogAccountSource } from '@/core/account-source/models'
import { IDialogConfig } from '@/types/common.i'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IAccountSourceDialogProps {
  fundId: string
  isDialogOpen: IDialogAccountSource
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  setIdRowClicked: React.Dispatch<React.SetStateAction<string>>
  handleCreate: (payload: IAccountSourceBody) => void
  handleUpdate: (payload: IAccountSourceBody) => void
  dataDetail: IAccountSourceDataFormat
}

export default function AccountSourceDialog({
  fundId,
  isDialogOpen,
  setIsDialogOpen,
  setIdRowClicked,
  handleCreate,
  handleUpdate,
  dataDetail
}: IAccountSourceDialogProps) {
  const { t } = useTranslation(['accountSource', 'common'])
  const handleSubmitAccountSource = (payload: IAccountSourceBody) => {
    if (isDialogOpen.isDialogUpdateOpen) handleUpdate(payload)
    if (isDialogOpen.isDialogCreateOpen) handleCreate(payload)
  }

  const updateConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      fundId,
      callBack: handleSubmitAccountSource,
      defaultValue: isDialogOpen.isDialogUpdateOpen ? dataDetail : initEmptyDetailAccountSourceType
    }),
    description: t('AccountSourceDialog.updateDialog.description'),
    title: t('AccountSourceDialog.updateDialog.title'),
    isOpen: isDialogOpen.isDialogUpdateOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
      setIdRowClicked('')
    }
  }

  const createConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      callBack: handleSubmitAccountSource,
      fundId
    }),
    description: t('AccountSourceDialog.createDialog.description'),
    title: t('AccountSourceDialog.createDialog.title'),
    isOpen: isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
    }
  }

  const detailsConfigDialog: IDialogConfig = {
    content: <DetailUpdateAccountSourceForm dataDetail={dataDetail} setIsDialogOpen={setIsDialogOpen} />,
    description: 'Thông tin chi tiết về account source',
    title: 'Chi tiết giao dịch account source',
    isOpen: isDialogOpen.isDialogDetailOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
    }
  }

  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
      <CustomDialog config={detailsConfigDialog} />
    </div>
  )
}
