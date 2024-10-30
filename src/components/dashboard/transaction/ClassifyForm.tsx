import { ITrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IClassifyTransactionFormData } from '@/core/transaction/models'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import { Combobox } from '../../core/Combobox'
import EditTrackerTypeDialog from '../EditTrackerType'
import { Input } from '../../ui/input'

interface ClassiFyFormProps {
  formData: IClassifyTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<IClassifyTransactionFormData>>
  trackerTransactionType: ITrackerTransactionType[]
  openEditTrackerTxTypeDialog: boolean
  setOpenEditTrackerTxTypeDialog: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ClassifyForm({
  formData,
  setFormData,
  trackerTransactionType,
  openEditTrackerTxTypeDialog,
  setOpenEditTrackerTxTypeDialog
}: ClassiFyFormProps) {
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
        <Label htmlFor='trackerTypeId' className='text-right'>
          Tracker Type
        </Label>
        <Combobox
          onValueSelect={(value) => {
            setFormData((prev) => ({ ...prev, trackerTypeId: value }))
          }}
          setOpenEditDialog={setOpenEditTrackerTxTypeDialog}
          dataArr={modifiedTrackerTypeForComboBox(trackerTransactionType)}
          // dialogEdit={EditTrackerTypeDialog({
          //   openEditDialog: openEditTrackerTxTypeDialog,
          //   setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
          //   dataArr: modifiedTrackerTypeForComboBox(trackerTransactionType)
          // })}
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
