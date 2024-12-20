import { initEmptyDetailAccountSourceType } from '@/app/dashboard/account-source/constants'
import { handleCreateAccountSource, handleUpdateAccountSource } from '@/app/dashboard/account-source/handler'
import CreateAndUpdateAccountSourceForm from '@/components/dashboard/account-source/Create&UpdateForm'
import DetailUpdateAccountSourceForm from '@/components/dashboard/account-source/DetailUpdateForm'
import CustomDialog from '@/components/dashboard/Dialog'
import { IDialogAccountSource } from '@/core/account-source/models'
import { IDialogConfig } from '@/types/common.i'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IAccountSourceDialogProps {
  fundId: string
  sharedDialogElements: {
    isDialogOpen: IDialogAccountSource
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
    hookResetCacheStatistic: any
    hookResetCacheGetAllAccount: any
  }
  createAccountSourceDialog: {
    createAccountSource: any
    setDataCreate: any
  }
  UpdateAccountSourceDialog: {
    setIdRowClicked: React.Dispatch<React.SetStateAction<string>>
    setDataUpdate: any
    updateAccountSource: any
    tableData?: any
    dataDetail?: any
  }
  detailAccountSourceDialog: {
    dataDetail: any
    setIdRowClicked: React.Dispatch<React.SetStateAction<string>>
  }
  onSuccessCallback: () => void
}

export default function AccountSourceDialog({
  sharedDialogElements,
  createAccountSourceDialog,
  UpdateAccountSourceDialog,
  detailAccountSourceDialog,
  fundId,
  onSuccessCallback
}: IAccountSourceDialogProps) {
  const { t } = useTranslation(['accountSource', 'common'])
  const handleSubmitAccountSource = (payload: any) => {
    if (sharedDialogElements.isDialogOpen.isDialogUpdateOpen) {
      handleUpdateAccountSource({
        payload,
        setIsDialogOpen: sharedDialogElements.setIsDialogOpen,
        updateAccountSource: UpdateAccountSourceDialog.updateAccountSource,
        setDataUpdate: UpdateAccountSourceDialog.setDataUpdate,
        setIdRowClicked: UpdateAccountSourceDialog.setIdRowClicked,
        hookResetCacheStatistic: sharedDialogElements.hookResetCacheStatistic,
        hookResetCacheGetAllAccount: sharedDialogElements.hookResetCacheGetAllAccount,
        onSuccessCallback
      })
    }
    if (sharedDialogElements.isDialogOpen.isDialogCreateOpen) {
      handleCreateAccountSource({
        payload: {
          ...payload,
          fundId
        },
        setIsDialogOpen: sharedDialogElements.setIsDialogOpen,
        createAccountSource: createAccountSourceDialog.createAccountSource,
        setDataCreate: createAccountSourceDialog.setDataCreate,
        hookResetCacheStatistic: sharedDialogElements.hookResetCacheStatistic,
        hookResetCacheGetAllAccount: sharedDialogElements.hookResetCacheGetAllAccount,
        onSuccessCallback
      })
    }
  }

  const updateConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      fundId,
      callBack: handleSubmitAccountSource,
      defaultValue: sharedDialogElements.isDialogOpen.isDialogUpdateOpen
        ? UpdateAccountSourceDialog.dataDetail
        : initEmptyDetailAccountSourceType
    }),
    description: t('AccountSourceDialog.updateDialog.description'),
    title: t('AccountSourceDialog.updateDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogUpdateOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
      UpdateAccountSourceDialog.setIdRowClicked('')
    }
  }

  const createConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      callBack: handleSubmitAccountSource,
      fundId
    }),
    description: t('AccountSourceDialog.createDialog.description'),
    title: t('AccountSourceDialog.createDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
    }
  }

  const detailsConfigDialog: IDialogConfig = {
    content: (
      <DetailUpdateAccountSourceForm
        detailUpdateAccountSource={{
          detailAccountSourceDialog,
          sharedDialogElements
        }}
      />
    ),
    description: t('AccountSourceDialog.detailsDialog.description'),
    title: t('AccountSourceDialog.detailsDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogDetailOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
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
