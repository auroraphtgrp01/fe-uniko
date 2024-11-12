import FormZod from '@/components/core/FormZod'
import { Badge } from '@/components/ui/badge'
import {
  defineUpdateExpenditureFundFormBody,
  updateExpenditureFundSchema
} from '@/core/expenditure-fund/constants/update-expenditure-fund'
import {
  EFundStatus,
  IUpdateExpenditureFundBody,
  IUpdateExpenditureFundFormProps
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { ArrowDownIcon, ArrowUpIcon, CalendarDays, Currency, Tag, Users2Icon } from 'lucide-react'

export default function UpdateExpenditureFundForm({
  handleUpdate,
  formUpdateRef,
  defaultValues,
  isEditing,
  setIsEditing,
  detailData
}: IUpdateExpenditureFundFormProps) {
  const getStatusColor = (status: EFundStatus) => {
    switch (status) {
      case EFundStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case EFundStatus.CLOSED:
        return 'bg-gray-100 text-gray-800'
      case EFundStatus.PENDING:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  return (
    <div>
      {isEditing ? (
        <FormZod
          formSchema={updateExpenditureFundSchema}
          formFieldBody={defineUpdateExpenditureFundFormBody({})}
          onSubmit={(data) => handleUpdate(data as IUpdateExpenditureFundBody, setIsEditing)}
          submitRef={formUpdateRef}
          defaultValues={defaultValues}
        />
      ) : (
        <div className='grid gap-6 py-4'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>{detailData.name}</h2>
              <Badge className={getStatusColor(detailData.status)}>{detailData.status}</Badge>
            </div>
            <p className='text-sm text-muted-foreground'>{detailData.description}</p>
          </div>

          <div className='rounded-lg bg-muted p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-medium'>Current Balance</span>
              <span className='text-2xl font-bold'>
                {detailData.currentAmount.toLocaleString()} {detailData.currency}
              </span>
            </div>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='flex items-center gap-2'>
                <CalendarDays className='h-4 w-4 text-muted-foreground' />
                <span>{/* {detailData.startDate} - {detailData.endDate} */}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Users2Icon className='h-4 w-4 text-muted-foreground' />
                {/* <span>{detailData.participants.length} Participants</span> */}
              </div>
              <div className='flex items-center gap-2'>
                <Currency className='h-4 w-4 text-muted-foreground' />
                <span>{detailData.currency}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className='mb-2 text-sm font-medium'>Expense Categories</h3>
            <div className='flex flex-wrap gap-2'>
              {/* {detailData.categories.map((category, index) => (
                <Badge key={index} variant='secondary'>
                  <Tag className='mr-1 h-3 w-3' />
                  {category}
                </Badge>
              ))} */}
            </div>
          </div>

          <div>
            <h3 className='mb-2 text-sm font-medium'>Participants</h3>
            <div className='flex flex-wrap gap-2'>
              {/* {detailData.participants.map((participant, index) => (
                <Badge key={index} variant='outline'>
                  {participant}
                </Badge>
              ))} */}
            </div>
          </div>

          <div>
            <h3 className='mb-2 text-sm font-medium'>Recent Transactions</h3>
            <div className='space-y-2'>
              {/* {detailData.recentTransactions.map((transaction, index) => (
                <div key={index} className='flex items-center justify-between rounded bg-muted p-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    {transaction.type === 'income' ? (
                      <ArrowUpIcon className='h-4 w-4 text-green-500' />
                    ) : (
                      <ArrowDownIcon className='h-4 w-4 text-red-500' />
                    )}
                    <span>{transaction.description}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.amount.toLocaleString()} {detailData.currency}
                    </span>
                    <span className='text-muted-foreground'>{transaction.date}</span>
                  </div>
                </div>
              ))} */}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='font-medium'>Fund Owner:</span>
              <span className='ml-2'>{detailData.ownerName}</span>
            </div>
            <div>
              <span className='font-medium'>Fund ID:</span>
              <span className='ml-2'>{detailData.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
