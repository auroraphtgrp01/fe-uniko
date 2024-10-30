import { ICreateTrackerTransactionFormData } from '@/core/transaction/models'
import { Combobox } from '../../core/Combobox'
import { MoneyInput } from '../../core/MoneyInput'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IAccountSource } from '@/core/account-source/models'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog, { IEditTrackerTypeDialogData } from '../EditTrackerType'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { useEffect, useState } from 'react'
import FormZod from '@/components/core/FormZod'
import {
  createTrackerTransactionSchema,
  defineCreateAccountSourceFormBody
} from '@/core/tracker-transaction/constants/create-tracker-transaction'

interface ICreateTrackerTransactionFormProps {
  incomeTrackerType: ITrackerTransactionType[]
  expenseTrackerType: ITrackerTransactionType[]
  accountSourceData: IAccountSource[]
  openEditTrackerTxTypeDialog: boolean
  setOpenEditTrackerTxTypeDialog: React.Dispatch<React.SetStateAction<boolean>>
  handleCreate: (data: ICreateTrackerTransactionFormData) => void
  handleCreateTrackerType: (
    data: ITrackerTransactionTypeBody,
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
  formCreateRef: React.RefObject<HTMLFormElement>
}

export default function CreateTrackerTransactionForm({
  incomeTrackerType,
  expenseTrackerType,
  accountSourceData,
  openEditTrackerTxTypeDialog,
  formCreateRef,
  setOpenEditTrackerTxTypeDialog,
  handleCreate,
  handleCreateTrackerType,
  handleUpdateTrackerType
}: ICreateTrackerTransactionFormProps) {
  const [currentDirection, setCurrentDirection] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )

  useEffect(() => {
    setTypeOfEditTrackerType(currentDirection)
  }, [currentDirection])

  return (
    <FormZod
      formSchema={createTrackerTransactionSchema}
      formFieldBody={defineCreateAccountSourceFormBody({
        accountSourceData,
        incomeTrackerType,
        expenseTrackerType,
        currentDirection,
        setCurrentDirection,
        setOpenEditTrackerTxTypeDialog,
        openEditTrackerTxTypeDialog,
        typeOfEditTrackerType,
        setTypeOfEditTrackerType,
        handleCreateTrackerType,
        handleUpdateTrackerType
      })}
      onSubmit={(data: any) => {
        const payload = { ...data, amount: Number(data.amount) }
        handleCreate(payload)
      }}
      submitRef={formCreateRef}
    />
  )
}
