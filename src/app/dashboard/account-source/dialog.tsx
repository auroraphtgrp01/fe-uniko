import { contentDialogAccountSourceForm } from '@/app/dashboard/account-source/constants'
import { handleCreateAccountSource, handleUpdateAccountSource } from '@/app/dashboard/account-source/handler'
import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { IDialogAccountSource } from '@/core/account-source/constants'
import { IAccountSourceBody, IAccountSourceDataFormat } from '@/types/account-source.i'
import { IDialogConfig } from '@/types/common.i'
import React from 'react'

export default function AccountSourceDialog({
  setIsDialogOpen,
  isDialogOpen,
  setFormData,
  formData,
  setData,
  setTableData,
  tableData,
  data,
  createAccountSource,
  updateAccountSource
}: {
  formData: IAccountSourceBody
  isDialogOpen: IDialogAccountSource
  data: IAccountSourceDataFormat[]
  tableData: IAccountSourceDataFormat[]
  createAccountSource: any
  updateAccountSource: any
  setData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
  setTableData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
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
            setData,
            setTableData,
            setFormData,
            updateAccountSource
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
      setIsDialogOpen((prev) => ({ ...prev, isCloseConfirmationDialog: true }))
    }
  }

  const closeConfirmationDialog: IDialogConfig = {
    title: 'Close Confirmation',
    content: 'Are you sure you want to close this dialog?',
    isOpen: isDialogOpen.isCloseConfirmationDialog,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isCloseConfirmationDialog: false }))
    },
    footer: (
      <>
        <Button
          type='button'
          variant={'greenPastel1'}
          onClick={() => {
            setFormData((prev) => ({ ...prev, name: '', type: '', initAmount: 0, currency: '' }))
            setIsDialogOpen((prev) => ({
              ...prev,
              isDialogCreateOpen: false,
              isCloseConfirmationDialog: false,
              isDialogUpdateOpen: false
            }))
          }}
        >
          Confirm
        </Button>
        <Button
          type='button'
          variant={'secondary'}
          onClick={() => {
            setIsDialogOpen((prev) => ({ ...prev, isCloseConfirmationDialog: false }))
          }}
        >
          Cancel
        </Button>
      </>
    )
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
            setData,
            setTableData,
            setFormData,
            data,
            tableData,
            createAccountSource
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
      setIsDialogOpen((prev) => ({ ...prev, isCloseConfirmationDialog: true }))
    }
  }
  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
      <CustomDialog config={closeConfirmationDialog} />
    </div>
  )
}
