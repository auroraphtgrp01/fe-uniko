import { contentDialogAccountSourceForm } from '@/app/dashboard/account-source/constants'
import { handleCreateAccountSource, handleUpdateAccountSource } from '@/app/dashboard/account-source/handler'
import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import {
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IDialogAccountSource
} from '@/core/account-source/models'
import { IDialogConfig } from '@/types/common.i'
import React from 'react'

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
  setDataUpdate
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
}) {
  const contentDialogForm = contentDialogAccountSourceForm({
    formData,
    setFormData
  })

  const updateConfigDialog: IDialogConfig = {
    content: contentDialogForm,
    footer: (
      <Button
        type='button'
        onClick={async () =>
          await handleUpdateAccountSource({
            formData,
            setIsDialogOpen,
            setFetchedData,
            setFormData,
            updateAccountSource,
            fetchedData,
            setDataUpdate
          })
        }
      >
        Save changes
      </Button>
    ),
    description: 'Please fill in the information below to update a account source.',
    title: 'Update Account Source',
    isOpen: isDialogOpen.isDialogUpdateOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
    }
  }

  const createConfigDialog: IDialogConfig = {
    content: contentDialogForm,
    footer: (
      <Button
        type='button'
        onClick={async () =>
          await handleCreateAccountSource({
            formData,
            setIsDialogOpen,
            setFetchedData,
            setFormData,
            createAccountSource,
            setDataCreate
          })
        }
      >
        Save changes
      </Button>
    ),
    description: 'Please fill in the information below to create a new account source.',
    title: 'Create Account Source',
    isOpen: isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
    }
  }
  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
    </div>
  )
}
