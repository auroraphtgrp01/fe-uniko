import { Button } from '@/components/ui/button'
import {
  EAccountSourceType,
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceFormData
} from '@/core/account-source/models'
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
import { EBankTypes, initEmptyAccountSource } from '@/app/dashboard/account-source/constants'

export default function CreateAndUpdateAccountSourceForm({
  callBack,
  defaultValue
}: {
  callBack: (payload: IAccountSourceBody) => void
  defaultValue?: IAccountSource
}) {
  const [typeState, setTypeState] = useState<EAccountSourceType>(EAccountSourceType.WALLET)
  const [defaultValueData, setDefaultValueData] = useState<IAccountSourceFormData>({
    accountBank: undefined,
    accountSource: { accountSourceName: '', accountSourceType: EAccountSourceType.WALLET, initAmount: '' }
  })
  useEffect(() => {
    console.log('>>>', defaultValue)
  }, [defaultValue])
  const formCreateAccountSourceRef = useRef<HTMLFormElement>(null)
  const formCreateAccountBankRef = useRef<HTMLFormElement>(null)

  const { t } = useTranslation(['accountSource'])
  let payload: IAccountSourceBody = { name: '', initAmount: 0, accountSourceType: EAccountSourceType.WALLET }
  const handleSubmit = (v: {
    accountSourceName: string
    initAmount?: string
    accountSourceType: EAccountSourceType
  }) => {
    payload = { ...v, id: defaultValue?.id, initAmount: Number(v.initAmount), name: v.accountSourceName }
    if (typeState !== EAccountSourceType.BANKING) callBack(payload)
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
          type: defaultValue.accountBank?.type ?? EBankTypes.MB_BANK,
          login_id: defaultValue.accountBank?.login_id ?? '',
          password: defaultValue.accountBank?.pass ?? '',
          accounts: defaultValue.accountBank
            ? defaultValue.accountBank.accounts.map((account) => account.accountNo)
            : []
        },
        accountSource: {
          accountSourceName: defaultValue.name,
          accountSourceType: defaultValue.type,
          initAmount: String(defaultValue.initAmount)
        }
      })
      setTypeState(defaultValue?.type)
    }
  }, [defaultValue])

  return (
    <div>
      <Fragment>
        {defaultValue === initEmptyAccountSource ? (
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
