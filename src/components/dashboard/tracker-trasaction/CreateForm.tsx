import { ICreateTrackerTransactionFormData } from '@/core/transaction/models'
import { Combobox } from '../../core/Combobox'
import { MoneyInput } from '../../core/MoneyInput'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import { ITrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IAccountSource } from '@/core/account-source/models'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '../EditTrackerType'

interface ICreateTrackerTransactionFormProps {
  formData: ICreateTrackerTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<ICreateTrackerTransactionFormData>>
  incomeTrackerType: ITrackerTransactionType[]
  expenseTrackerType: ITrackerTransactionType[]
  accountSourceData: IAccountSource[]
  openEditTrackerTxTypeDialog: boolean
  setOpenEditTrackerTxTypeDialog: React.Dispatch<React.SetStateAction<boolean>>
  dataEditTrackerType: { value: string; label: string }[]
  setDataEditTrackerType: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>
}

export default function CreateTrackerTransactionForm({
  formData,
  setFormData,
  incomeTrackerType,
  expenseTrackerType,
  accountSourceData,
  openEditTrackerTxTypeDialog,
  setOpenEditTrackerTxTypeDialog,
  dataEditTrackerType,
  setDataEditTrackerType
}: ICreateTrackerTransactionFormProps) {
  return (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='reasonName' className='text-right'>
          Reason Name
        </Label>
        <Input
          value={formData.reasonName}
          required
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, reasonName: e.target.value }))
          }}
          className='col-span-3'
          placeholder='Reason name *'
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='amount' className='text-right'>
          Amount
        </Label>
        <MoneyInput
          defaultValue={formData.amount}
          required
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))
          }}
          className='col-span-3'
          placeholder='Amount *'
        />
      </div>

      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='accountSourceId' className='text-right'>
          Account Source
        </Label>
        <Select
          required
          onValueChange={(value) => setFormData((prev) => ({ ...prev, accountSourceId: value }))}
          value={formData.accountSourceId}
        >
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Select a tracker type' />
          </SelectTrigger>
          <SelectContent>
            {accountSourceData.length > 0
              ? accountSourceData.map((item: IAccountSource) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))
              : ''}
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='direction' className='text-right'>
          Direction
        </Label>
        <Select
          required
          onValueChange={(value) => setFormData((prev) => ({ ...prev, direction: value }))}
          value={formData.direction}
        >
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Select a direction' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={'INCOMING'} value={'INCOMING'}>
              Incoming
            </SelectItem>
            <SelectItem key={'EXPENSE'} value={'EXPENSE'}>
              Expense
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='trackerTypeId' className='text-right'>
          Tracker Type
        </Label>
        <Combobox
          onValueSelect={(value) => {
            setFormData((prev) => ({ ...prev, trackerTypeId: value }))
          }}
          setOpenEditDialog={setOpenEditTrackerTxTypeDialog}
          dataArr={modifiedTrackerTypeForComboBox(
            formData.direction ? (formData.direction === 'INCOMING' ? incomeTrackerType : expenseTrackerType) : []
          )}
          dialogEdit={EditTrackerTypeDialog({
            openEditDialog: openEditTrackerTxTypeDialog,
            setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
            dataArr: dataEditTrackerType
          })}
          label='Tracker Transaction Type'
          className='col-span-3'
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='description' className='text-right'>
          Description
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }}
          className='col-span-3'
          placeholder='Description'
        />
      </div>
    </div>
  )
}
