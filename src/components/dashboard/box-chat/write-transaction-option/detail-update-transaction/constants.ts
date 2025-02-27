import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { IAccountSource } from '@/core/account-source/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { IUpdateTrackerTransactionFormProps } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const updateTransactionSchema = z
  .object({
    reasonName: z.string({ message: 'Reason name is required' }),
    amount: z
      .any()
      .transform((value) => parseFloat(value))
      .refine((value) => !isNaN(value) && value > 0, {
        message: 'Amount must be a valid number & greater than 0'
      }),
    accountSourceId: z.string({ message: 'Account source is required' }),
    trackerTypeId: z.string({ message: 'Category is required' }).uuid({ message: 'Category is invalid' })
  })
  .strict()

export const defineUpdateTransactionFormBody = ({
  editTrackerTypeDialogProps,
  expenseTrackerType,
  incomeTrackerType,
  typeOfEditTrackerType,
  setTypeOfEditTrackerType,
  setOpenEditDialog,
  openEditDialog,
  accountSourceData
}: IUpdateTrackerTransactionFormProps): IBodyFormField[] => {
  const t = translate(['transaction', 'common'])
  return [
    {
      name: 'reasonName',
      type: EFieldType.Input,
      label: t('TransactionType.defineClassifyTransactionFormBody.reasonName.label'),
      placeHolder: t('TransactionType.defineClassifyTransactionFormBody.reasonName.placeholder'),
      props: {
        autoComplete: 'reasonName'
      }
    },
    {
      name: 'amount',
      type: EFieldType.Input,
      label: 'Amount',
      placeHolder: 'Amount *',
      props: {
        type: 'number',
        autoComplete: 'amount'
      }
    },
    {
      name: 'trackerTypeId',
      type: EFieldType.Combobox,
      label: t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.label'),
      placeHolder: t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.placeholder'),
      props: {
        autoComplete: 'trackerTypeId',
        setOpenEditDialog,
        dataArr: modifiedTrackerTypeForComboBox(
          editTrackerTypeDialogProps.typeDefault === ETypeOfTrackerTransactionType.INCOMING
            ? incomeTrackerType
            : expenseTrackerType
        ),
        dialogEdit: EditTrackerTypeDialog({
          ...editTrackerTypeDialogProps,
          dataArr: modifiedTrackerTypeForComboBox(
            typeOfEditTrackerType === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
          ),
          type: typeOfEditTrackerType,
          setType: setTypeOfEditTrackerType,
          setOpenEditDialog,
          openEditDialog
        }),
        label: t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.labelTrackerTransactionType')
      }
    },
    {
      name: 'accountSourceId',
      type: EFieldType.Select,
      label: 'Account Source',
      placeHolder: 'Select Account Source',
      dataSelector: modifiedTrackerTypeForComboBox(accountSourceData)
    }
  ]
}
