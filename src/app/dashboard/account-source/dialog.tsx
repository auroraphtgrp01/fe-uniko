import { initEmptyAccountSource, initEmptyDetailAccountSourceType } from '@/app/dashboard/account-source/constants'
import {
  handleCreateAccountSource,
  handleSubmitAccountSource,
  handleUpdateAccountSource
} from '@/app/dashboard/account-source/handler'
import CreateAndUpdateAccountSourceForm from '@/components/dashboard/account-source/Create&UpdateForm'
import DetailUpdateAccountSourceForm from '@/components/dashboard/account-source/DetailUpdateForm'
import CustomDialog from '@/components/dashboard/Dialog'
import {
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IDialogAccountSource,
  TAccountSourceActions
} from '@/core/account-source/models'
import { IDialogConfig } from '@/types/common.i'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface IAccountSourceDialogProps {
  fundId: string
  sharedDialogElements: {
    isDialogOpen: IDialogAccountSource
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  }
  callBack: (payload: IAccountSourceBody) => void
  detailAccountSourceDialog: {
    dataDetail: IAccountSource
    setIdRowClicked: React.Dispatch<React.SetStateAction<string>>
  }
}

export default function AccountSourceDialog({
  sharedDialogElements,
  detailAccountSourceDialog,
  callBack
}: IAccountSourceDialogProps) {
  const { t } = useTranslation(['accountSource', 'common'])

  const updateConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      callBack,
      defaultValue: detailAccountSourceDialog.dataDetail
    }),
    description: t('AccountSourceDialog.updateDialog.description'),
    title: t('AccountSourceDialog.updateDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogUpdateOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
      detailAccountSourceDialog.setIdRowClicked('')
    }
  }

  const createConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      callBack,
      defaultValue: initEmptyAccountSource
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
        sharedDialogElements={sharedDialogElements}
        detailAccountSource={detailAccountSourceDialog.dataDetail}
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
