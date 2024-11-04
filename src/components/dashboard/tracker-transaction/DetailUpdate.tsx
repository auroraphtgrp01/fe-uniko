import { ITrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import DetailUpdateTransaction from '../transaction/DetailUpdate'
import { IAccountSource } from '@/core/account-source/models'

interface IDetailUpdateTrackerTransactionProps {
  trackerTransaction: ITrackerTransaction
  accountSourceData: IAccountSource[]
}

export default function DetailUpdateTrackerTransaction({
  trackerTransaction,
  accountSourceData
}: IDetailUpdateTrackerTransactionProps) {
  const { Transaction, ...rest } = trackerTransaction
  return (
    <div></div>
    // <DetailUpdateTransaction
    //   commonProps={{ accountSourceData }}
    //   updateTrackerTransactionProps={{ trackerTransaction: rest }}
    //   updateTransactionProps={{ transaction: Transaction }}
    // />
  )
}
