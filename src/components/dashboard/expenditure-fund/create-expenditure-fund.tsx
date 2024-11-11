import FormZod from '@/components/core/FormZod'
import {
  createExpenditureFundSchema,
  defineCreateExpenditureFundFormBody
} from '@/core/expenditure-fund/constants/create-expenditure-fund.constant'
import {
  ICreateExpenditureFundBody,
  ICreateExpenditureFundFormProps
} from '@/core/expenditure-fund/models/expenditure-fund.interface'

export default function CreateExpenditureFundForm({ handleCreate, formCreateRef }: ICreateExpenditureFundFormProps) {
  return (
    <FormZod
      formSchema={createExpenditureFundSchema}
      formFieldBody={defineCreateExpenditureFundFormBody({})}
      onSubmit={(data) => handleCreate({ ...data } as ICreateExpenditureFundBody)}
      submitRef={formCreateRef}
    />
  )
}
