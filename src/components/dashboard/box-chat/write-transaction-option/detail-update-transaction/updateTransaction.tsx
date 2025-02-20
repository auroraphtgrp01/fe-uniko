import FormZod from '@/components/core/FormZod'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { defineUpdateTransactionFormBody, updateTransactionSchema } from './constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { handleCancelEdit } from '@/app/chatbox/handler'
import { IAccountSource } from '@/core/account-source/models'
import { Transaction } from '@/app/chatbox/constants'
import { initEmptyAccountSource } from '@/app/dashboard/account-source/constants'

interface IUpdateTransactionProps {
  transaction: Transaction
  incomeTrackerType: ITrackerTransactionType[]
  expenseTrackerType: ITrackerTransactionType[]
  trackerType: ITrackerTransactionType[]
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>
  accountSources: IAccountSource[]
}

export const UpdateTransaction = (props: IUpdateTransactionProps) => {
  const { incomeTrackerType, expenseTrackerType, trackerType, setEditingId, accountSources, transaction } = props
  const accountSourceData = useMemo(() => {
    return [
      ...accountSources,
      {
        ...initEmptyAccountSource,
        id: transaction.wallet?.id || 'unknown',
        name: transaction.walletName
      }
    ]
  }, [accountSources, transaction.wallet])
  const formRef = useRef<HTMLFormElement>(null)
  console.log('🚀 ~ UpdateTransaction ~ transaction:', transaction)

  // state
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    trackerType[0].type as ETypeOfTrackerTransactionType
  )
  const [isOpenEditDialog, setIsOpenEditDialog] = useState<boolean>(false)

  // effect
  useEffect(() => {
    setTypeOfEditTrackerType(trackerType[0].type as ETypeOfTrackerTransactionType)
  }, [trackerType])

  return (
    <div>
      <FormZod
        defaultValues={{
          reasonName: transaction.description,
          amount: transaction.amount,
          trackerTypeId: transaction.categoryId,
          accountSourceId: transaction.wallet?.id || 'unknown'
        }}
        formFieldBody={defineUpdateTransactionFormBody({
          incomeTrackerType,
          expenseTrackerType,
          currentDirection: typeOfEditTrackerType,
          accountSourceData: accountSourceData,
          typeOfEditTrackerType,
          setTypeOfEditTrackerType,
          openEditDialog: isOpenEditDialog,
          setOpenEditDialog: setIsOpenEditDialog,
          editTrackerTypeDialogProps: {
            typeDefault: trackerType[0].type as ETypeOfTrackerTransactionType,
            expenditureFund: [],
            handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {},
            handleCreateTrackerType: (
              data: ITrackerTransactionTypeBody,
              setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
            ) => {}
          }
        })}
        formSchema={updateTransactionSchema}
        onSubmit={(data) => console.log(data)}
        submitRef={formRef}
      />
      <div className='mt-2 flex items-center justify-end gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            handleCancelEdit(setEditingId)
          }}
        >
          <X className='mr-2 h-4 w-4' />
          Hủy
        </Button>
        <Button
          size='sm'
          onClick={() => {
            formRef.current?.requestSubmit()
          }}
        >
          <Check className='mr-2 h-4 w-4' />
          Lưu
        </Button>
      </div>
    </div>
  )
}
