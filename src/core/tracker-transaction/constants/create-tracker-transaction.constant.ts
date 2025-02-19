import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'

export const defineCreateTrackerTransactionFormBody = ({
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
  handleUpdateTrackerType,
  expenditureFund
}: any) => {
  const t = translate(['trackerTransaction'])
  return [
    {
      name: 'reasonName',
      type: EFieldType.Input,
      label: t('form.defineCreateTrackerTransactionFormBody.reasonName.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.reasonName.placeholder'),
      props: {
        autoComplete: 'reasonName'
      }
    },
    {
      name: 'amount',
      type: EFieldType.MoneyInput,
      label: t('form.defineCreateTrackerTransactionFormBody.amount.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.amount.placeholder'),
      props: {
        autoComplete: 'amount'
      }
    },
    {
      name: 'accountSourceId',
      type: EFieldType.Select,
      label: t('form.defineCreateTrackerTransactionFormBody.accountSourceId.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.accountSourceId.placeholder'),
      props: {
        onchange: (value: any) => {
          setCurrentDirection(value as ETypeOfTrackerTransactionType)
        }
      },
      dataSelector: modifiedTrackerTypeForComboBox(accountSourceData)
    },
    {
      name: 'direction',
      type: EFieldType.Select,
      label: t('form.defineCreateTrackerTransactionFormBody.direction.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.direction.placeholder'),
      props: {
        autoComplete: 'direction',
        onchange: (value: any) => {
          setCurrentDirection(value as ETypeOfTrackerTransactionType)
        }
      },
      dataSelector: [
        {
          value: 'INCOMING',
          label: 'INCOMING'
        },
        {
          value: 'EXPENSE',
          label: 'EXPENSE'
        }
      ]
    },
    {
      name: 'trackerTypeId',
      type: EFieldType.Combobox,
      label: t('form.defineCreateTrackerTransactionFormBody.trackerTypeId.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.trackerTypeId.placeholder'),
      props: {
        autoComplete: 'trackerTypeId',
        setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
        dataArr: modifiedTrackerTypeForComboBox(
          currentDirection === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
        ),
        dialogEdit: EditTrackerTypeDialog({
          openEditDialog: openEditTrackerTxTypeDialog,
          setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
          dataArr: modifiedTrackerTypeForComboBox(
            typeOfEditTrackerType === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
          ),
          typeDefault: currentDirection || ETypeOfTrackerTransactionType.INCOMING,
          type: typeOfEditTrackerType,
          setType: setTypeOfEditTrackerType,
          handleCreateTrackerType,
          handleUpdateTrackerType,
          expenditureFund
        }),
        label: 'Tracker Transaction Type'
      }
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: t('form.defineCreateTrackerTransactionFormBody.description.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.description.placeholder'),
      props: {
        autoComplete: 'description'
      }
    }
  ]
}

export const createTrackerTransactionSchema = z
  .object({
    reasonName: z
      .string({
        message: 'Reason name must be a valid string'
      })
      .trim()
      .min(5, { message: 'Reason name must be at least 5 characters long' })
      .max(100, { message: 'Reason name must not exceed 100 characters' }),
    amount: z
      .any()
      .transform((value) => parseFloat(value))
      .refine((value) => !isNaN(value) && value > 0, {
        message: 'Amount must be a valid number & greater than 0'
      }),
    accountSourceId: z
      .string({ message: 'Please select a account source' })
      .uuid({ message: 'Account source ID is not a valid UUID format' }),
    direction: z.enum(['INCOMING', 'EXPENSE'], { message: 'Direction must be either "Incoming" or "Expense"' }),
    trackerTypeId: z
      .string({ message: 'Please select a tracker type' })
      .uuid({ message: 'Tracker type ID is not a valid UUID format' }),
    description: z.any()
  })
  .strict()
