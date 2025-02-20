import { DataTable, IDeleteProps } from '@/components/dashboard/DataTable'
import CustomDialog from '@/components/dashboard/Dialog'
import {
  IClassifyTransactionBody,
  IDataTransactionTable,
  IDialogTransaction,
  ITransaction,
  IUpdateTransactionBody
} from '@/core/transaction/models'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { ColumnDef } from '@tanstack/react-table'
import React, { useRef, useState } from 'react'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import ClassifyForm from '@/components/dashboard/transaction/ClassifyForm'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { initTableConfig } from '@/constants/data-table'
import { useTranslation } from 'react-i18next'
import DetailUpdateTransactionDialog from '@/components/dashboard/transaction/DetailUpdate'
import { IAccountSource } from '@/core/account-source/models'
import { initEmptyDetailTransactionData } from './constants'

export interface ITransactionDialogProps {
  dataTable: {
    columns: ColumnDef<any>[]
    transactionTodayData: IDataTransactionTable[]
    unclassifiedTransactionData: IDataTransactionTable[]
    setConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    config: IDataTableConfig
    setUncConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    uncConfig: IDataTableConfig
    setTodayConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    todayConfig: IDataTableConfig
    advancedData: ITransaction[]
  }
  dialogDetailUpdate: {
    dataDetail: ITransaction
    setDataDetail: React.Dispatch<React.SetStateAction<ITransaction>>
    accountSourceData: IAccountSource[]
    handleUpdate: (data: IUpdateTransactionBody, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>) => void
    statusUpdateTransaction: 'error' | 'success' | 'pending' | 'idle'
  }
  dialogState: {
    isDialogOpen: IDialogTransaction
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTransaction>>
  }
  classifyDialog: {
    incomeTrackerTransactionType: ITrackerTransactionType[]
    expenseTrackerTransactionType: ITrackerTransactionType[]
    handleClassify: (
      data: IClassifyTransactionBody,
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    typeOfTrackerType: ETypeOfTrackerTransactionType
    setTypeOfTrackerType: React.Dispatch<React.SetStateAction<ETypeOfTrackerTransactionType>>
  }
  dialogEditTrackerType: {
    handleCreateTrackerType: (
      data: ITrackerTransactionTypeBody,
      setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
    expenditureFund: { label: string; value: string | number }[]
  }
  deleteProps: {
    deleteAnTransactionProps: IDeleteProps
  }
}

export default function TransactionDialog(params: ITransactionDialogProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const { t } = useTranslation(['transaction', 'common'])
  const formClassifyRef = useRef<HTMLFormElement>(null)
  // useStates
  const { dataTable, dialogState, classifyDialog, dialogEditTrackerType, dialogDetailUpdate, deleteProps } = params

  const detailsConfigDialog: IDialogConfig = {
    content: (
      <DetailUpdateTransactionDialog
        updateTransactionProps={{
          transaction: dialogDetailUpdate.dataDetail,
          handleUpdateTransaction: dialogDetailUpdate.handleUpdate,
          isEditing,
          setIsEditing,
          statusUpdateTransaction: dialogDetailUpdate.statusUpdateTransaction
        }}
        commonProps={{
          accountSourceData: dialogDetailUpdate.accountSourceData
        }}
        classifyDialogProps={{
          ClassifyForm: () => (
            <ClassifyForm
              transactionId={dialogDetailUpdate.dataDetail.id}
              incomeTrackerType={classifyDialog.incomeTrackerTransactionType}
              expenseTrackerType={classifyDialog.expenseTrackerTransactionType}
              editTrackerTypeDialogProps={{
                typeDefault: classifyDialog.typeOfTrackerType,
                handleCreateTrackerType: dialogEditTrackerType.handleCreateTrackerType,
                handleUpdateTrackerType: dialogEditTrackerType.handleUpdateTrackerType,
                expenditureFund: dialogEditTrackerType.expenditureFund
              }}
              formClassifyRef={formClassifyRef}
              handleClassify={(data: IClassifyTransactionBody) => {
                classifyDialog.handleClassify(data, setIsEditing)
              }}
            />
          ),
          formClassifyRef
        }}
      />
    ),
    description: t('transaction:TransactionType.detailsDialog.description'),
    title: t('transaction:TransactionType.detailsDialog.title'),
    isOpen: dialogState.isDialogOpen.isDialogDetailOpen,
    onClose: () => {
      dialogDetailUpdate.setDataDetail(initEmptyDetailTransactionData)
      setIsEditing(false)
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
    }
  }
  const transactionsTodayConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={dataTable.columns}
          data={dataTable.transactionTodayData}
          onRowClick={(rowData) => {
            classifyDialog.setTypeOfTrackerType(rowData.direction)
            dialogDetailUpdate.setDataDetail(
              dataTable.advancedData.find((e) => e.id === rowData.id) || initEmptyDetailTransactionData
            )
            dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
          }}
          setConfig={dataTable.setTodayConfig}
          config={dataTable.todayConfig}
          deleteProps={deleteProps.deleteAnTransactionProps}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: t('transaction:TransactionType.transactionsTodayDialog.description'),
    title: t('transaction:TransactionType.transactionsTodayDialog.title'),
    isOpen: dialogState.isDialogOpen.isDialogTransactionTodayOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogTransactionTodayOpen: false }))
      dataTable.setTodayConfig({
        ...initTableConfig,
        isVisibleSortType: false,
        classNameOfScroll: 'h-[calc(100vh-35rem)]'
      })
    }
  }
  const unclassifiedTransactionsConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={dataTable.columns}
          data={dataTable.unclassifiedTransactionData}
          onRowClick={(rowData) => {
            dialogDetailUpdate.setDataDetail(
              dataTable.advancedData.find((item) => item.id === rowData.id) || initEmptyDetailTransactionData
            )
            dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
            classifyDialog.setTypeOfTrackerType(rowData.direction)
          }}
          setConfig={dataTable.setUncConfig}
          config={dataTable.uncConfig}
          deleteProps={deleteProps.deleteAnTransactionProps}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: t('transaction:TransactionType.unclassifiedTransactionsDialog.description'),
    title: t('transaction:TransactionType.unclassifiedTransactionsDialog.title'),
    isOpen: dialogState.isDialogOpen.isDialogUnclassifiedTransactionOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedTransactionOpen: false }))
      dataTable.setUncConfig({
        ...initTableConfig,
        isVisibleSortType: false,
        classNameOfScroll: 'h-[calc(100vh-35rem)]'
      })
    }
  }
  return (
    <div>
      <CustomDialog config={detailsConfigDialog} />
      <CustomDialog config={transactionsTodayConfigDialog} />
      <CustomDialog config={unclassifiedTransactionsConfigDialog} />
    </div>
  )
}
