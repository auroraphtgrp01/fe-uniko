import { IClassiFyFormProps, IClassifyTransactionBody } from '@/core/transaction/models'
import { useEffect, useState } from 'react'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import FormZod from '@/components/core/FormZod'
import {
  classifyTransactionSchema,
  defineClassifyTransactionFormBody
} from '@/core/transaction/constants/classify-transaction.constant'

export default function ClassifyForm({
  transactionId,
  incomeTrackerType,
  expenseTrackerType,
  formClassifyRef,
  handleClassify,
  editTrackerTypeDialogProps
}: IClassiFyFormProps) {
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    editTrackerTypeDialogProps.typeDefault
  )

  const [isOpenDialogEditTrackerType, setIsOpenDialogEditTrackerType] = useState<boolean>(false)
  useEffect(() => {
    setTypeOfEditTrackerType(editTrackerTypeDialogProps.typeDefault)
  }, [editTrackerTypeDialogProps.typeDefault])

  useEffect(() => {
    console.log('🚀 ~ typeOfEditTrackerType:', typeOfEditTrackerType)
  }, [typeOfEditTrackerType])

  return (
    <FormZod
      formSchema={classifyTransactionSchema}
      formFieldBody={defineClassifyTransactionFormBody({
        editTrackerTypeDialogProps,
        expenseTrackerType,
        incomeTrackerType,
        typeOfEditTrackerType,
        setTypeOfEditTrackerType,
        setOpenEditDialog: setIsOpenDialogEditTrackerType,
        openEditDialog: isOpenDialogEditTrackerType
      })}
      onSubmit={(data) => handleClassify({ ...data, transactionId } as IClassifyTransactionBody)}
      submitRef={formClassifyRef}
    />
  )
}
