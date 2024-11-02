import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { useTranslation } from 'react-i18next'
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
  const t = translate(['accountSource'])
  return [
    {
      name: 'reasonName',
      type: EFieldType.Input,
      label: t('form.defineCreateAccountSourceFormBody.reasonName.label'),
      placeHolder: t('form.defineCreateAccountSourceFormBody.reasonName.placeholder'),
      props: {
        autoComplete: 'reasonName'
      }
    },
    {
      name: 'amount',
      type: EFieldType.Input,
      label: t('form.defineCreateAccountSourceFormBody.reasonName.label'),
      placeHolder: t('form.defineCreateAccountSourceFormBody.reasonName.placeholder'),
      props: {
        type: 'number',
        autoComplete: 'amount'
      }
    },
    {
      name: 'accountSourceId',
      type: EFieldType.Combobox,
      label: t('form.defineCreateAccountSourceFormBody.accountSourceId.label'),
      placeHolder: t('form.defineCreateAccountSourceFormBody.accountSourceId.placeholder'),
      props: {
        autoComplete: 'accountSourceId',
        dataArr: modifiedTrackerTypeForComboBox(accountSourceData)
      }
    },
    {
      name: 'direction',
      type: EFieldType.Select,
      label: t('form.defineCreateAccountSourceFormBody.direction.label'),
      placeHolder: t('form.defineCreateAccountSourceFormBody.direction.placeholder'),
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
      label: t('form.defineCreateAccountSourceFormBody.trackerTypeId.label'),
      placeHolder: t('form.defineCreateAccountSourceFormBody.trackerTypeId.placeholder'),
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
          handleUpdateTrackerType
        }),
        label: 'Tracker Transaction Type'
      }
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: t('form.defineCreateAccountSourceFormBody.description.label'),
      placeHolder: t('form.defineCreateAccountSourceFormBody.description.placeholder'),
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
