import FormZod from '@/components/core/FormZod'
import {
  defineUpdateExpenditureFundFormBody,
  updateExpenditureFundSchema
} from '@/core/expenditure-fund/constants/update-expenditure-fund'
import {
  ECurrencyUnit,
  EFundStatus,
  IUpdateExpenditureFundBody,
  IUpdateExpenditureFundFormProps
} from '@/core/expenditure-fund/models/expenditure-fund.interface'

export default function UpdateExpenditureFundForm({
  handleUpdate,
  formUpdateRef,
  defaultValues
}: IUpdateExpenditureFundFormProps) {
  const { id, ...rest } = defaultValues
  return (
    <div>
      <FormZod
        formSchema={updateExpenditureFundSchema}
        formFieldBody={defineUpdateExpenditureFundFormBody({})}
        onSubmit={(data: any) => {
          const payload: IUpdateExpenditureFundBody = {
            ...data,
            id
          }
          handleUpdate(payload)
        }}
        submitRef={formUpdateRef}
        defaultValues={rest}
      />
    </div>
  )
}
