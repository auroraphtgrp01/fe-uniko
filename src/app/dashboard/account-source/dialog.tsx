import { handleCreateAccountSource, handleUpdateAccountSource } from '@/app/dashboard/account-source/handler'
import CreateAndUpdateAccountSourceForm from '@/components/dashboard/account-source/Create&UpdateForm'
import CustomDialog from '@/components/dashboard/Dialog'
import { IDialogAccountSource } from '@/core/account-source/models'
import { IDialogConfig } from '@/types/common.i'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IAccountSourceDialogProps {
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
  }
}

export default function AccountSourceDialog({
  sharedDialogElements,
  createAccountSourceDialog,
  UpdateAccountSourceDialog
}: IAccountSourceDialogProps) {
  const { t } = useTranslation(['accountSource', 'common'])
  const updateConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({}),
    description: t('AccountSourceDialog.updateDialog.description'),
    title: t('AccountSourceDialog.updateDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogUpdateOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
      UpdateAccountSourceDialog.setIdRowClicked('')
    }
  }
  const handleSubmitAccountSource = (payload: any) => {
    if (sharedDialogElements.isDialogOpen.isDialogUpdateOpen) {
      handleUpdateAccountSource({
        payload,
        setIsDialogOpen: sharedDialogElements.setIsDialogOpen,
        updateAccountSource: UpdateAccountSourceDialog.updateAccountSource,
        setDataUpdate: UpdateAccountSourceDialog.setDataUpdate,
        setIdRowClicked: UpdateAccountSourceDialog.setIdRowClicked,
        hookResetCacheStatistic: sharedDialogElements.hookResetCacheStatistic,
        hookResetCacheGetAllAccount: sharedDialogElements.hookResetCacheGetAllAccount
      })
    }
    if (sharedDialogElements.isDialogOpen.isDialogCreateOpen) {
      handleCreateAccountSource({
        payload,
        setIsDialogOpen: sharedDialogElements.setIsDialogOpen,
        createAccountSource: createAccountSourceDialog.createAccountSource,
        setDataCreate: createAccountSourceDialog.setDataCreate,
        hookResetCacheStatistic: sharedDialogElements.hookResetCacheStatistic,
        hookResetCacheGetAllAccount: sharedDialogElements.hookResetCacheGetAllAccount
      })
    }
  }
  const createConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      callBack: handleSubmitAccountSource
    }),
    description: t('AccountSourceDialog.createDialog.description'),
    title: t('AccountSourceDialog.createDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
    }
  }

  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
    </div>
  )
}
