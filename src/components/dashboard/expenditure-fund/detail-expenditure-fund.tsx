import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  EFundStatus,
  IDetailExpenditureFundProps,
  IExpenditureFundParticipant,
  IUpdateExpenditureFundFormProps
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarDays,
  CheckIcon,
  Clock,
  Command,
  DeleteIcon,
  EditIcon,
  Loader2Icon,
  MailIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  PlusIcon,
  SaveIcon,
  Search,
  Tag,
  Trash2Icon,
  Undo2Icon,
  UserPlus,
  Users2Icon,
  XIcon
} from 'lucide-react'
import Image from 'next/image'
import EmptyBox from '@/images/empty-box.png'
import NoDataPlaceHolder from '@/images/2.png'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/tooltip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import AvatarDefault from '@/images/avatar.jpg'
import { InviteParticipantForm } from './invite-participant'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CreateTrackerTypeForm from '../CreateTrackerTypeForm'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import FormZod from '@/components/core/FormZod'
import {
  IEditTrackerTypeDialogData,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  defineEditTrackerTypeBody,
  editTrackerTypeSchema
} from '@/core/tracker-transaction-type/constants/update-tracker-transaction-type.constant'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import { IDialogConfig } from '@/types/common.i'
import CustomDialog from '../Dialog'

export function DetailExpenditureFund({ detailData, inviteTabProps, categoryTabProps }: IDetailExpenditureFundProps) {
  console.log(detailData)

  const [valueSearch, setValueSearch] = useState<string>('')
  const [type, setType] = useState<ETypeOfTrackerTransactionType>(ETypeOfTrackerTransactionType.INCOMING)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [accordionValue, setAccordionValue] = useState<string | null>(null)
  const editCategories: IEditTrackerTypeDialogData[] = useMemo(
    () => modifiedTrackerTypeForComboBox(detailData.categories.filter((category) => category.type === type)),
    [detailData.categories, type]
  )
  const filteredDataArr = editCategories?.filter((data: IEditTrackerTypeDialogData) =>
    data.label.toLowerCase().includes(valueSearch.trim().toLowerCase())
  )
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const formRefCreate = useRef<HTMLFormElement>(null)
  const formRefEdit = useRef<HTMLFormElement>(null)
  const { user } = useStoreLocal()

  const onHandleUpdate = () => {
    if (isUpdate) {
      formRefEdit.current?.requestSubmit()
    }
    setIsUpdate(!isUpdate)
  }
  const getStatusColor = (status: EFundStatus) => {
    switch (status) {
      case EFundStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case EFundStatus.CLOSED:
        return 'bg-gray-700'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getRoleBadge = (role: IExpenditureFundParticipant['role']) => {
    switch (role) {
      case 'OWNER':
        return (
          <Badge
            style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
            className='bg-yellow-500 text-yellow-900'
          >
            Owner
          </Badge>
        )
      case 'ADMIN':
        return (
          <Badge
            style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
            className='bg-blue-500 text-blue-900'
          >
            Admin
          </Badge>
        )
      case 'MEMBER':
        return (
          <Badge
            style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
            className='bg-gray-500 text-gray-900'
          >
            Member
          </Badge>
        )
    }
  }

  const createTrackerTypeDialog: IDialogConfig = {
    content: (
      <CreateTrackerTypeForm
        typeOfTrackerType={type}
        formRef={formRefCreate}
        handleCreateTrackerType={categoryTabProps.handleCreate}
        setIsCreating={setIsCreating}
        selectType={true}
      />
    ),
    isOpen: isCreating,
    onClose: () => setIsCreating(false),
    title: 'Create Tracker Transaction Type',
    description: 'Create a new tracker transaction type',
    footer: (
      <Button onClick={() => formRefCreate.current?.requestSubmit()} type='button'>
        Save
      </Button>
    )
  }

  return (
    <>
      <div className='flex items-center justify-between text-2xl font-bold'>
        <span>{detailData.name}</span>
        <Badge
          style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
          className={getStatusColor(detailData.status)}
        >
          {detailData.status}
        </Badge>
      </div>
      <Tabs defaultValue='overview' className='h-[23rem] w-full'>
        <TabsList className='grid w-full grid-cols-5 pb-10'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='transactions'>Transactions</TabsTrigger>
          <TabsTrigger value='statistics'>Statistics</TabsTrigger>
          <TabsTrigger value='participants'>Participants</TabsTrigger>
          <TabsTrigger value='categories'>Categories</TabsTrigger>
        </TabsList>
        <TabsContent value='overview' className='h-[23rem] space-y-4'>
          <div className='rounded-lg bg-muted p-3'>
            <div className='grid grid-cols-10 grid-rows-1 gap-2'>
              <div className='col-span-6'>
                <div className='flex flex-col justify-between'>
                  <div>
                    <span className='mb-1 text-sm font-medium'>Current Balance</span>
                    <div className='text-2xl font-bold'>{formatCurrency(detailData.currentAmount, 'đ')}</div>
                  </div>
                </div>
              </div>
              <div className='col-span-4 col-start-8 items-start'>
                <div className='flex h-full flex-col justify-center space-y-2 text-sm'>
                  <div className='flex h-4'>
                    <CalendarDays className='mr-2 h-4 w-4 text-muted-foreground' />
                    {formatDateTimeVN(detailData.time, true)}
                  </div>
                  <div className='flex h-4'>
                    <Users2Icon className='mr-2 h-4 w-4 text-muted-foreground' />
                    {detailData.participants.length} Participants
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className='mb-2 text-sm font-medium'>Description</h3>
            <p className='text-sm text-muted-foreground'>
              {!detailData.description || detailData.description === ''
                ? 'Description content...'
                : detailData.description}
            </p>
          </div>
          <div>
            <h3 className='mb-2 text-sm font-medium'>Expense Categories</h3>
            <div className='flex flex-wrap gap-2'>
              {detailData.categories.length > 0 ? (
                detailData.categories.map((category, index) => (
                  <Badge key={index} variant='secondary'>
                    <Tag className='mr-1 h-3 w-3' />
                    {category.name}
                  </Badge>
                ))
              ) : (
                <p className='text-sm text-muted-foreground'>Categories...</p>
              )}
            </div>
          </div>
          <div>
            <h3 className='mb-2 text-sm font-medium'>Participants</h3>
            <div className='flex gap-2'>
              {detailData.participants.map((participant, index) => (
                <Badge key={index} variant='outline'>
                  {participant.user.fullName}
                </Badge>
              ))}
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='font-medium'>Fund Owner:</span>
              <span className='ml-2'>{detailData.owner.fullName}</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value='transactions' className='h-[23rem] space-y-4'>
          <h3 className='mb-2 text-lg font-semibold'>Recent Transactions</h3>
          <div className='space-y-2'>
            {detailData.transactions.length > 0 ? (
              detailData.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className='grid grid-cols-5 grid-rows-1 items-center gap-4 rounded bg-muted p-2 text-sm'
                >
                  <div className='col-span-3 flex items-center gap-2'>
                    {transaction.direction === ETypeOfTrackerTransactionType.INCOMING ? (
                      <ArrowUpIcon className='h-4 w-4 text-green-500' />
                    ) : (
                      <ArrowDownIcon className='h-4 w-4 text-red-500' />
                    )}
                    <span>{transaction.TrackerTransaction ? transaction.TrackerTransaction.reasonName : 'N/A'}</span>
                  </div>
                  <div className='col-start-4'>
                    <Badge
                      style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
                      className='no-wrap'
                      variant={transaction.TrackerTransaction !== undefined ? 'outline' : 'greenPastel1'}
                    >
                      {transaction.TrackerTransaction
                        ? transaction.TrackerTransaction.TrackerType.name
                        : 'Unclassified'}
                    </Badge>
                  </div>
                  <div className='col-start-5 flex gap-2 text-end'>
                    <div className='flex text-end'>
                      <span
                        className={
                          transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                            ? 'font-semibold text-green-500'
                            : 'font-semibold text-red-500'
                        }
                      >
                        {transaction.direction === ETypeOfTrackerTransactionType.INCOMING ? '+' : '-'}
                        {formatCurrency(transaction.amount, 'đ')}
                      </span>
                      <span className='text-muted-foreground'>
                        {/* {formatDateTimeVN(transaction.transactionDateTime, false)} */}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center p-4'>
                <div className='text-center'>
                  <Image priority src={EmptyBox} alt='' height={60} width={60} className='mx-auto' />
                  <span className='mt-2 block text-sm font-semibold text-foreground'>No data available</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value='statistics' className='h-[23rem] space-y-4'>
          {true ? (
            <div className='flex flex-col items-center justify-center pt-20'>
              <Image priority src={NoDataPlaceHolder} alt='No data available' width={150} height={150} />
              <span className='mt-2 text-sm font-semibold text-foreground'>No data available</span>
            </div>
          ) : (
            <>
              <h3 className='text-lg font-semibold'>Monthly Spending</h3>
              {/* Chart */}
            </>
          )}
        </TabsContent>
        {/* {detailData.owner.id === user.id && (
          
        )} */}
        <TabsContent value='participants' className='h-[23rem] space-y-4'>
          <TooltipProvider>
            <div className='grid w-full grid-cols-6 items-end gap-2'>
              <div className='col-span-5 h-full w-full'>
                <InviteParticipantForm
                  formInviteRef={inviteTabProps.formRef}
                  handleInvite={inviteTabProps.handleInvite}
                />
              </div>
              <div className='col-span-1 w-full'>
                <Button
                  onClick={() => inviteTabProps.formRef.current?.requestSubmit()}
                  disabled={false}
                  className='flex h-full w-full items-center justify-center'
                >
                  {false ? <Loader2Icon className='h-4 w-4 animate-spin' /> : <UserPlus className='mr-2 h-4 w-4' />}
                  Invite
                </Button>
              </div>
            </div>

            <ScrollArea className='h-[255px] rounded-md border'>
              <div className='space-y-2 p-2'>
                {detailData.participants.map((participant) => (
                  <div key={participant.id} className='flex items-center justify-between rounded-lg bg-[#2a2a2a] p-2'>
                    <div className='flex items-center space-x-3'>
                      <Avatar>
                        <AvatarImage
                          src={participant.user.avatar === null ? AvatarDefault.src : participant.user.avatar}
                        />
                        <AvatarFallback>{participant.user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-sm font-medium text-white'>{participant.user.fullName}</p>
                        <p className='text-xs text-gray-400'>{participant.user.email}</p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      {participant.status === 'ACCEPTED' ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <CheckIcon className='h-4 w-4 text-green-500' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Accepted</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger>
                            <Clock className='h-4 w-4 text-yellow-500' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pending</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {getRoleBadge(participant.role)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontalIcon className='h-4 w-4 text-gray-400' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='border-gray-700 bg-[#2a2a2a]'>
                          <DropdownMenuItem className='text-gray-200 focus:bg-gray-700 focus:text-white'>
                            <MailIcon className='mr-2 h-4 w-4' />
                            <span>Send Email</span>
                          </DropdownMenuItem>
                          {participant.role !== 'OWNER' && (
                            <DropdownMenuItem
                              className='text-red-400 focus:bg-red-900 focus:text-red-100'
                              onClick={() => {}}
                            >
                              <Trash2Icon className='mr-2 h-4 w-4' />
                              <span>Remove</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TooltipProvider>
        </TabsContent>
        <TabsContent value='categories' className='h-[23rem] space-y-4'>
          <div className='w-full space-y-3'>
            <Input
              value={valueSearch}
              onChange={(e) => setValueSearch(e.target.value)}
              className='w-full border-gray-700 bg-gray-800 text-white'
              placeholder='Search Tracker Transaction Type'
            />
            <div className='flex space-x-2'>
              <Select onValueChange={(value) => setType(value as ETypeOfTrackerTransactionType)} value={type}>
                <SelectTrigger>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='INCOMING'>Incoming</SelectItem>
                  <SelectItem value='EXPENSE'>Expense</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className='w-full whitespace-nowrap sm:w-auto'
                variant='secondary'
                onClick={() => setIsCreating(true)}
              >
                Create <PlusIcon className='ml-1 h-4 w-4' />
              </Button>
            </div>
            <ScrollArea className='h-52 overflow-y-auto rounded-md border p-4'>
              <Accordion
                onValueChange={(value) => {
                  setAccordionValue(value)
                }}
                type='single'
                collapsible
                className='w-full'
              >
                {filteredDataArr.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className='text-white hover:text-gray-300'>
                      <span>{item.label}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='flex w-full justify-between'>
                        <Button variant={'destructive'}>
                          Delete
                          <DeleteIcon className='h-4' />
                        </Button>
                        <div className='flex gap-2'>
                          {isUpdate && (
                            <Button
                              onClick={() => {
                                setIsUpdate(false)
                              }}
                              className='w-full'
                              variant={'blueVin'}
                            >
                              <div className='flex w-full justify-between'>
                                <Undo2Icon className='h-4' />
                                <span>Discard</span>
                              </div>
                            </Button>
                          )}
                          <Button variant={'default'} onClick={onHandleUpdate} className='w-full'>
                            {isUpdate ? (
                              <div>
                                <div className='flex w-full justify-between'>
                                  <SaveIcon className='h-4' />
                                  <span>Save</span>
                                </div>
                              </div>
                            ) : (
                              <div className='flex w-full justify-between'>
                                <EditIcon className='h-4' />
                                <span>Edit</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className='grid gap-4 py-4'>
                        <FormZod
                          submitRef={formRefEdit}
                          defaultValues={{
                            name: item.name,
                            type: item.type as ETypeOfTrackerTransactionType,
                            description: item.description
                          }}
                          formFieldBody={defineEditTrackerTypeBody(
                            isUpdate,
                            item.type as ETypeOfTrackerTransactionType
                          )}
                          formSchema={editTrackerTypeSchema}
                          onSubmit={(data) => {
                            categoryTabProps.handleUpdate({
                              ...data,
                              id: accordionValue
                            } as ITrackerTransactionTypeBody)
                          }}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
      <CustomDialog config={createTrackerTypeDialog} />
    </>
  )
}
