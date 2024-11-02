import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { useTranslation } from 'react-i18next'
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
      name: 'trackerTypeId',
      type: EFieldType.Combobox,
      label: t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.label'),
      placeHolder: t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.placeholder'),
      props: {
        autoComplete: 'trackerTypeId',
        onValueSelect: (value) => {
          console.log('🚀 ~ value:', value)
        },
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
        label: t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.labelTrackerTransactionType')
      }
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: t('TransactionType.defineClassifyTransactionFormBody.description.label'),
      placeHolder: t('TransactionType.defineClassifyTransactionFormBody.description.placeholder'),
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
    description: z.string().min(10).max(256).optional()
  })
  .strict()
