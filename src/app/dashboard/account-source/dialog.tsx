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

export default function AccountSourceDialog({
  setIsDialogOpen,
  isDialogOpen,
  setFormData,
  formData,
  setFetchedData,
  fetchedData,
  createAccountSource,
  updateAccountSource,
  setDataCreate,
  setDataUpdate,
  setIdRowClicked
}: {
  formData: IAccountSourceBody
  isDialogOpen: IDialogAccountSource
  fetchedData: IAccountSource[]
  tableData: IAccountSourceDataFormat[]
  createAccountSource: any
  updateAccountSource: any
  setFetchedData: React.Dispatch<React.SetStateAction<IAccountSource[]>>
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
  setTableData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  setDataCreate: any
  setDataUpdate: any
  setIdRowClicked: React.Dispatch<React.SetStateAction<string>>
}) {
  const updateConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({}),
    description: 'Please fill in the information below to update a account source.',
    title: 'Update Account Source',
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
        setFetchedData,
        setFormData,
        updateAccountSource,
        fetchedData,
        setDataUpdate,
        setIdRowClicked
      })
    }
    if (isDialogOpen.isDialogCreateOpen) {
      handleCreateAccountSource({
        payload,
        setIsDialogOpen,
        setFetchedData,
        setFormData,
        createAccountSource,
        setDataCreate
      })
    }
  }
  const createConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      setFormData,
      callBack: handleSubmitAccountSource
    }),
    description: 'Please fill in the information below to create a new account source.',
    title: 'Create Account Source',
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
