import {
  ITrackerTransaction,
  IUpdateTrackerTransactionBody
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import DetailUpdateTransaction from '../transaction/DetailUpdate'
import { IAccountSource } from '@/core/account-source/models'
import { ITransaction, IUpdateTransactionBody } from '@/core/transaction/models'

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
  return (
    <DetailUpdateTransaction
      commonProps={{ accountSourceData: commonProps.accountSourceData }}
      updateTrackerTransactionProps={{
        trackerTransaction: rest,
        statusUpdateTrackerTransaction: updateTrackerTransactionProps.statusUpdateTrackerTransaction,
        isEditing: updateTrackerTransactionProps.isEditing,
        setIsEditing: updateTrackerTransactionProps.setIsEditing,
        handleUpdateTrackerTransaction: updateTrackerTransactionProps.handleUpdateTrackerTransaction
      }}
      updateTransactionProps={{
        transaction: Transaction,
        handleUpdateTransaction: updateTransactionProps.handleUpdateTransaction,
        statusUpdateTransaction: updateTransactionProps.statusUpdateTransaction,
        isEditing: updateTrackerTransactionProps.isEditing,
        setIsEditing: updateTrackerTransactionProps.setIsEditing
      }}
    />
  )
}
