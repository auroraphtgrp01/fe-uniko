import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const defineCreateAccountSourceFormBody = ({
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
}: any) => {
  return [
    {
      name: 'reasonName',
      type: EFieldType.Input,
      label: 'Reason Name',
      placeHolder: 'Enter reason name',
      props: {
        autoComplete: 'reasonName'
      }
    },
    {
      name: 'amount',
      type: EFieldType.Input,
      label: 'Amount',
      placeHolder: 'Enter amount',
      props: {
        type: 'number',
        autoComplete: 'amount'
      }
    },
    {
      name: 'accountSourceId',
      type: EFieldType.Combobox,
      label: 'Account Source',
      placeHolder: 'Select account source',
      props: {
        autoComplete: 'accountSourceId',
        dataArr: modifiedTrackerTypeForComboBox(accountSourceData)
      }
    },
    {
      name: 'direction',
      type: EFieldType.Select,
      label: 'Direction',
      placeHolder: 'Select a direction',
      props: {
        autoComplete: 'direction',
        onchange: (value: any) => {
          console.log('🚀 ~ value:', value)

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
      label: 'Tracker Type',
      placeHolder: 'Select tracker type',
      props: {
        autoComplete: 'trackerTypeId',
        onValueSelect: (value: any) => {
          console.log('🚀 ~ value:', value)
        },
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
          handleUpdateTrackerType
        }),
        label: 'Tracker Transaction Type'
      }
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: 'Description',
      placeHolder: 'Enter description',
      props: {
        autoComplete: 'description'
      }
    }
  ]
}

export const createTrackerTransactionSchema = z
  .object({
    reasonName: z.string().trim().min(2).max(256),
    amount: z.string().min(0, { message: 'Initial Amount is required' }),
    accountSourceId: z.string().uuid(),
    direction: z.enum(['INCOMING', 'EXPENSE']),
    trackerTypeId: z.string().uuid(),
    description: z.string().min(10).max(256).optional()
  })
  .strict()
