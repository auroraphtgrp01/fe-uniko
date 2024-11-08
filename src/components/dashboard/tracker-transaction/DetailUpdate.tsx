import {
  ITrackerTransaction,
  IUpdateTrackerTransactionBody
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import DetailUpdateTransaction from '../transaction/DetailUpdate'
import { IAccountSource } from '@/core/account-source/models'
import { ITransaction, IUpdateTransactionBody } from '@/core/transaction/models'
import { useEffect, useState } from 'react'
import {
  IEditTrackerTypeDialogProps,
  ITrackerTransactionType
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

interface IDetailUpdateTrackerTransactionProps {
  updateTransactionProps: {
    statusUpdateTransaction: 'error' | 'success' | 'pending' | 'idle'
    handleUpdateTransaction: (
      data: IUpdateTransactionBody,
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
  }
  updateTrackerTransactionProps: {
    trackerTransaction: ITrackerTransaction
    statusUpdateTrackerTransaction: 'error' | 'success' | 'pending' | 'idle'
    handleUpdateTrackerTransaction: (
      data: IUpdateTrackerTransactionBody,
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    incomeTrackerType: ITrackerTransactionType[]
    expenseTrackerType: ITrackerTransactionType[]
    editTrackerTypeDialogProps: Omit<
      IEditTrackerTypeDialogProps,
      'dataArr' | 'type' | 'setType' | 'setOpenEditDialog' | 'openEditDialog'
    >
    setOpenEditTrackerTxTypeDialog: React.Dispatch<React.SetStateAction<boolean>>
    openEditTrackerTxTypeDialog: boolean
  }
  commonProps: {
    accountSourceData: IAccountSource[]
  }
}

export default function DetailUpdateTrackerTransaction({
  updateTrackerTransactionProps,
  updateTransactionProps,
  commonProps
}: IDetailUpdateTrackerTransactionProps) {
  const { Transaction, ...rest } = updateTrackerTransactionProps.trackerTransaction
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  return (
    <DetailUpdateTransaction
      commonProps={{ accountSourceData: commonProps.accountSourceData }}
      updateTrackerTransactionProps={{
        trackerTransaction: rest,
        statusUpdateTrackerTransaction: updateTrackerTransactionProps.statusUpdateTrackerTransaction,
        isEditing: updateTrackerTransactionProps.isEditing,
        setIsEditing: updateTrackerTransactionProps.setIsEditing,
        handleUpdateTrackerTransaction: updateTrackerTransactionProps.handleUpdateTrackerTransaction,
        editTrackerTransactionTypeProps: {
          incomeTrackerType: updateTrackerTransactionProps.incomeTrackerType,
          expenseTrackerType: updateTrackerTransactionProps.expenseTrackerType,
          editTrackerTypeDialogProps: updateTrackerTransactionProps.editTrackerTypeDialogProps
        },
        typeOfEditTrackerType,
        setTypeOfEditTrackerType,
        setOpenEditDialog: updateTrackerTransactionProps.setOpenEditTrackerTxTypeDialog,
        openEditDialog: updateTrackerTransactionProps.openEditTrackerTxTypeDialog
      }}
      updateTransactionProps={{
        transaction: { ...(Transaction as ITransaction), time: rest.time },
        handleUpdateTransaction: updateTransactionProps.handleUpdateTransaction,
        statusUpdateTransaction: updateTransactionProps.statusUpdateTransaction,
        isEditing: updateTrackerTransactionProps.isEditing,
        setIsEditing: updateTrackerTransactionProps.setIsEditing
      }}
    />
  )
}
