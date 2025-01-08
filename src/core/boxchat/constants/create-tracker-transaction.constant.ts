import { z } from 'zod';

export const transactionSchema = z.object({
  description: z.string().min(1, 'Tên giao dịch không được để trống'),
  amount: z.number().min(0, 'Số tiền phải lớn hơn hoặc bằng 0'),
  categoryId: z.string().min(1, 'Danh mục không được để trống'),
  accountSourceId: z.string().min(1, 'Ví không được để trống')
});

import { EFieldType, IBodyFormField } from '@/types/formZod.interface';

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
  return [
    {
      name: 'description',
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