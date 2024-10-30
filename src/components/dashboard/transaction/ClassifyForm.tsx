import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IClassifyTransactionFormData } from '@/core/transaction/models'
import { useEffect, useState } from 'react'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import FormZod from '@/components/core/FormZod'
import {
  classifyTransactionSchema,
  defineClassifyTransactionFormBody
} from '@/core/transaction/constants/classify-transaction.constant'

interface ClassiFyFormProps {
  transactionId: string
  incomeTrackerType: ITrackerTransactionType[]
  expenseTrackerType: ITrackerTransactionType[]
  openEditTrackerTxTypeDialog: boolean
  setOpenEditTrackerTxTypeDialog: React.Dispatch<React.SetStateAction<boolean>>
  typeOfTrackerType: ETypeOfTrackerTransactionType
  formClassifyRef: React.RefObject<HTMLFormElement>
  handleClassify: (data: IClassifyTransactionFormData) => void
  handleCreateTrackerType: (
    data: ITrackerTransactionTypeBody,
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
}

export default function ClassifyForm({
  transactionId,
  incomeTrackerType,
  expenseTrackerType,
  openEditTrackerTxTypeDialog,
  setOpenEditTrackerTxTypeDialog,
  typeOfTrackerType,
  formClassifyRef,
  handleClassify,
  handleCreateTrackerType,
  handleUpdateTrackerType
}: ClassiFyFormProps) {
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(typeOfTrackerType)
  useEffect(() => {
    setTypeOfEditTrackerType(typeOfTrackerType)
  }, [typeOfTrackerType])

  return (
    <FormZod
      formSchema={classifyTransactionSchema}
      formFieldBody={defineClassifyTransactionFormBody({
        setOpenEditTrackerTxTypeDialog,
        typeOfTrackerType,
        handleUpdateTrackerType,
        handleCreateTrackerType,
        setTypeOfEditTrackerType,
        typeOfEditTrackerType,
        openEditTrackerTxTypeDialog,
        expenseTrackerType,
        incomeTrackerType
      })}
      onSubmit={(data) => handleClassify({ ...data, transactionId } as IClassifyTransactionFormData)}
      submitRef={formClassifyRef}
    />
  )
}
