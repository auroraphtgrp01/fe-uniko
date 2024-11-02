import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const defineClassifyTransactionFormBody = ({
  setOpenEditTrackerTxTypeDialog,
  typeOfTrackerType,
  handleUpdateTrackerType,
  handleCreateTrackerType,
  setTypeOfEditTrackerType,
  typeOfEditTrackerType,
  openEditTrackerTxTypeDialog,
  expenseTrackerType,
  incomeTrackerType
}: any): IBodyFormField[] => {
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
      name: 'trackerTypeId',
      type: EFieldType.Combobox,
      label: 'Tracker Type',
      placeHolder: 'Select tracker type',
      props: {
        autoComplete: 'trackerTypeId',
        setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
        dataArr: modifiedTrackerTypeForComboBox(
          typeOfTrackerType === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
        ),
        dialogEdit: EditTrackerTypeDialog({
          openEditDialog: openEditTrackerTxTypeDialog,
          setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
          dataArr: modifiedTrackerTypeForComboBox(
            typeOfTrackerType === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
          ),
          typeDefault: typeOfTrackerType,
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

export const classifyTransactionSchema = z
  .object({
    reasonName: z.string().trim().min(2).max(256),
    trackerTypeId: z.string().uuid(),
    description: z.any()
  })
  .strict()
