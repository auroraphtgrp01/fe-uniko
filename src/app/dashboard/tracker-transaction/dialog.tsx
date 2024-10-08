import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { contentDialogForm } from './constants'
import { DataTable } from '@/components/dashboard/DataTable'

export interface ITrackerTransactionDialogProps {
  columns: any[]
  isDialogOpen: IDialogTrackerTransaction
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  dataTable: any[]
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>
  tableConfig: IDataTableConfig
  setTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
}
export default function TrackerTransactionDialog({
  columns,
  isDialogOpen,
  setIsDialogOpen,
  dataTable,
  setDataTable,
  tableConfig,
  setTableConfig
}: ITrackerTransactionDialogProps) {
  const createConfigDialog: IDialogConfig = {
    content: contentDialogForm,
    footer: <Button type='submit'>Save changes</Button>,
    description: 'Please fill in the information below to create a new transaction.',
    title: 'Create Transaction',
    isOpen: isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
      // setFormData((prev) => ({
      //   ...prev,
      //   name: '',
      //   type: EAccountSourceType.WALLET,
      //   initAmount: 0,
      //   currency: ''
      // }))
    }
  }

  const classifyConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={columns}
          data={dataTable}
          config={tableConfig}
          setConfig={setTableConfig}
          onRowClick={() => {}}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: 'Please fill in the information below to classify a transaction',
    title: 'Classify transactions',
    isOpen: isDialogOpen.isDialogClassifyOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyOpen: false }))
    }
  }

  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={classifyConfigDialog} />
    </div>
  )
}
