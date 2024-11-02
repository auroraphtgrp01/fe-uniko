import { Button } from '@/components/ui/button'
import { EAccountSourceType } from '@/core/account-source/models'
import { PlusCircle } from 'lucide-react'
import FormZod from '../../core/FormZod'
import {
  createAccountSourceFormBody,
  createAccountSourceSchema
} from '@/core/account-source/constants/create-account-source.constant'
import { useEffect, useRef, useState } from 'react'
import {
  createAccountBankFormBody,
  createAccountBankSchema
} from '@/core/account-source/constants/create-account-bank.constant'
import { useTranslation } from 'react-i18next'

export default function CreateAndUpdateAccountSourceForm({ callBack, defaultValue }: any) {
  const [typeState, setTypeState] = useState<EAccountSourceType>(EAccountSourceType.WALLET)
  const [defaultValueData, setDefaultValueData] = useState<any>({})
  const formCreateAccountSourceRef = useRef<HTMLFormElement>(null)
  const formCreateAccountBankRef = useRef<HTMLFormElement>(null)
  let payload = {}
  const { t } = useTranslation(['accountSource'])
  const handleSubmit = (v: any) => {
    payload = { ...v, initAmount: Number(v.initAmount), name: v.accountSourceName }
    if (typeState !== EAccountSourceType.BANKING) {
      callBack(payload)
    }
  }

  const handleSubmitBank = (v: any) => {
    payload = { ...payload, ...v }
    callBack(payload)
  }

  const onSubmitAll = () => {
    if (typeState === EAccountSourceType.BANKING) {
      formCreateAccountBankRef.current?.requestSubmit()
    }
    formCreateAccountSourceRef.current?.requestSubmit()
  }

  useEffect(() => {
    setDefaultValueData({
      accountBank: {
        type: defaultValue?.type,
        login_id: defaultValue?.login_id,
        password: defaultValue?.password,
        accounts: defaultValue?.accounts
      },
      accountSource: {
        accountSourceName: defaultValue?.accountSourceName,
        accountSourceType: defaultValue?.accountSourceType,
        initAmount: defaultValue?.initAmount
      }
    })
  }, [defaultValue])
  return (
    <div>
      <FormZod
        defaultValues={defaultValueData.accountSource}
        classNameForm='space-y-4'
        formSchema={createAccountSourceSchema}
        formFieldBody={createAccountSourceFormBody(setTypeState)}
        onSubmit={handleSubmit}
        submitRef={formCreateAccountSourceRef}
      />
      {typeState === EAccountSourceType.BANKING && (
        <FormZod
          defaultValues={defaultValueData.accountBank}
          classNameForm='space-y-4 mt-4'
          formSchema={createAccountBankSchema}
          formFieldBody={createAccountBankFormBody}
          onSubmit={handleSubmitBank}
          submitRef={formCreateAccountBankRef}
        />
      )}

      <Button onClick={onSubmitAll} className='mt-4 w-full'>
        {t('form.button.save_changes_account_source')}
      </Button>
    </div>
  )
}
