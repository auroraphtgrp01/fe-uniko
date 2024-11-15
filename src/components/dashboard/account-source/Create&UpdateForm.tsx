import { Button } from '@/components/ui/button'
import { EAccountSourceType } from '@/core/account-source/models'
import { PlusCircle } from 'lucide-react'
import FormZod from '../../core/FormZod'
import {
  createAccountSourceFormBody,
  createAccountSourceSchema
} from '@/core/account-source/constants/create-account-source.constant'
import { Fragment, useEffect, useRef, useState } from 'react'
import {
  createAccountBankFormBody,
  createAccountBankSchema
} from '@/core/account-source/constants/create-account-bank.constant'
import { useTranslation } from 'react-i18next'
import {
  updateAccountSourceFormBody,
  updateAccountSourceSchema
} from '@/core/account-source/constants/update-account-source.constant'
import {
  updateAccountBankFormBody,
  updateAccountBankSchema
} from '@/core/account-source/constants/update-account-bank.constant'

export default function CreateAndUpdateAccountSourceForm({ callBack, defaultValue, fundId }: any) {
  const [typeState, setTypeState] = useState<EAccountSourceType>(EAccountSourceType.WALLET)
  const [defaultValueData, setDefaultValueData] = useState<any>({})
  const formCreateAccountSourceRef = useRef<HTMLFormElement>(null)
  const formCreateAccountBankRef = useRef<HTMLFormElement>(null)
  let payload = { fundId }

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
    if (defaultValue) {
      setDefaultValueData({
        accountBank: {
          id: defaultValue?.data?.accountBank?.id ?? '',
          type: defaultValue?.data?.accountBank?.type ?? '',
          login_id: defaultValue?.data?.accountBank?.login_id ?? '',
          accounts: defaultValue?.data?.accountBankId ?? ''
        },
        accountSource: {
          id: defaultValue?.id,
          accountSourceName: defaultValue?.name,
          accountSourceType: defaultValue?.checkType
        }
      })
      setTypeState(defaultValue?.checkType)
    }
  }, [defaultValue])

  return (
    <div>
      <Fragment>
        {!defaultValue ? (
          <Fragment>
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
          </Fragment>
        ) : (
          <Fragment>
            <FormZod
              defaultValues={defaultValueData.accountSource}
              classNameForm='space-y-4'
              formSchema={updateAccountSourceSchema}
              formFieldBody={updateAccountSourceFormBody(setTypeState)}
              onSubmit={handleSubmit}
              submitRef={formCreateAccountSourceRef}
            />

            {typeState === EAccountSourceType.BANKING && (
              <FormZod
                defaultValues={defaultValueData.accountBank}
                classNameForm='space-y-4 mt-4'
                formSchema={updateAccountBankSchema}
                formFieldBody={updateAccountBankFormBody}
                onSubmit={handleSubmitBank}
                submitRef={formCreateAccountBankRef}
              />
            )}
          </Fragment>
        )}
      </Fragment>
      <Button onClick={onSubmitAll} className='mt-4 w-full'>
        {t('form.button.save_changes_account_source')}
      </Button>
    </div>
  )
}
