import { initAccountSourceFormData } from '@/app/dashboard/account-source/constants'
import { handleCreateAccountSource, handleUpdateAccountSource } from '@/app/dashboard/account-source/handler'
import CreateAndUpdateAccountSourceForm from '@/components/dashboard/account-source/Create&UpdateForm'
import CustomDialog from '@/components/dashboard/Dialog'
import {
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IDialogAccountSource
} from '@/core/account-source/models'
import { IDialogConfig } from '@/types/common.i'
import React, { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

export default function AccountSourceDialog({
  setIsDialogOpen,
  isDialogOpen,
  setFormData,
  formData,
  createAccountSource,
  updateAccountSource,
  setDataCreate,
  setDataUpdate,
  setIdRowClicked,
  hookResetCacheStatistic
}: {
  formData: IAccountSourceBody
  isDialogOpen: IDialogAccountSource
  tableData: IAccountSourceDataFormat[]
  createAccountSource: any
  updateAccountSource: any
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
  setTableData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  setDataCreate: any
  setDataUpdate: any
  setIdRowClicked: React.Dispatch<React.SetStateAction<string>>
  hookResetCacheStatistic: any
}) {
  const { t } = useTranslation(['accountSource', 'common'])
  const updateConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({}),
    description: t('AccountSourceDialog.updateDialog.description'),
    title: t('AccountSourceDialog.updateDialog.title'),
    isOpen: isDialogOpen.isDialogUpdateOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
      setFormData(initAccountSourceFormData)
      setIdRowClicked('')
    }
  }
  const handleSubmitAccountSource = (payload: any) => {
    if (isDialogOpen.isDialogUpdateOpen) {
      handleUpdateAccountSource({
        payload,
        setIsDialogOpen,
        setFormData,
        updateAccountSource,
        setDataUpdate,
        setIdRowClicked,
        hookResetCacheStatistic
      })
    }
    if (isDialogOpen.isDialogCreateOpen) {
      handleCreateAccountSource({
        payload,
        setIsDialogOpen,
        setFormData,
        createAccountSource,
        setDataCreate,
        hookResetCacheStatistic
      })
    }
  }
  const createConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      setFormData,
      callBack: handleSubmitAccountSource
    }),
    description: t('AccountSourceDialog.createDialog.description'),
    title: t('AccountSourceDialog.createDialog.title'),
    isOpen: isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
      setFormData(initAccountSourceFormData)
    }
  }

  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
    </div>
  )
}
