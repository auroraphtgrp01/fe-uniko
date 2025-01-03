'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, X, MessageCircle, Square, Pencil, Repeat } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AvatarUniko from '@/images/avatar.jpg'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { formatCurrency, mergeQueryParams } from '@/libraries/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getAccessTokenFromLocalStorage } from '@/libraries/helpers'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAccountSource } from '@/core/account-source/hooks'
import { ITrackerTransactionType, ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import { IGetTransactionResponse } from '@/core/transaction/models'
import { useExpenditureFund } from '@/core/expenditure-fund/hooks'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { GET_ADVANCED_TRANSACTION_KEY, GET_TODAY_TRANSACTION_KEY, GET_UNCLASSIFIED_TRANSACTION_KEY } from '@/core/transaction/constants'
import { IAdvancedTrackerTransactionResponse, TTrackerTransactionActions } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { updateCacheDataTransactionForClassify } from '@/app/dashboard/transaction/handler'
import { GET_ADVANCED_TRACKER_TRANSACTION_KEY } from '@/core/tracker-transaction/constants'
import { initTrackerTypeData, updateCacheDataCreateClassify } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { Combobox } from '@/components/core/Combobox'
import { IEditForm, Message, Transaction, typeCallBack } from '@/app/dashboard/tracker-transaction/constants'
import toast from 'react-hot-toast'
import { initQueryOptions } from '@/constants/init-query-options'
import { GET_ADVANCED_EXPENDITURE_FUND_KEY, GET_STATISTIC_EXPENDITURE_FUND_KEY } from '@/core/expenditure-fund/constants'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'
import { IQueryOptions } from '@/types/query.interface'

export function ChatBox() {
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const { user, fundId } = useStoreLocal()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Xin chào! Tôi có thể giúp gì cho bạn?', sender: 'bot' }
  ])
  const [transactions, setTransactions] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  let typingInterval: NodeJS.Timeout | null = null
  const [isTyping, setIsTyping] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTransactions, setSelectedTransactions] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForms, setEditForms] = useState<IEditForm>({})
  const [apiData, setApiData] = useState<{
    message: Message, transactions: Transaction[]
  }[]>([])
  const [editedTransactions, setEditedTransactions] = useState<any[]>([])
  // hook
  const [incomingTrackerType, setIncomingTrackerType] = useState<ITrackerTransactionType[]>([])
  const [expenseTrackerType, setExpenseTrackerType] = useState<ITrackerTransactionType[]>([])
  const [openEditTrackerTxTypeDialog, setOpenEditTrackerTxTypeDialog] = useState(false)
  const { getAllTrackerTransactionType, createTrackerTxType, updateTrackerTxType } = useTrackerTransactionType()
  const { dataTrackerTransactionType, refetchTrackerTransactionType } = getAllTrackerTransactionType(fundId)
  const { getAllAccountSource } = useAccountSource()
  const { getAllData: getAllAccountSourceData } = getAllAccountSource(fundId)
  const { getAllExpenditureFund } = useExpenditureFund()
  const { getAllExpenditureFundData } = getAllExpenditureFund()
  const [typesState, setTypesState] = useState<Record<string, ETypeOfTrackerTransactionType>>({})
  const { resetData: resetAccountSource } = useUpdateModel([GET_ADVANCED_ACCOUNT_SOURCE_KEY], () => { })
  const { resetData: resetCacheTransaction } = useUpdateModel<IGetTransactionResponse>(
    [GET_ADVANCED_TRANSACTION_KEY],
    updateCacheDataTransactionForClassify
  )

  const { resetData: resetCacheTrackerTx } = useUpdateModel<IAdvancedTrackerTransactionResponse>(
    [GET_ADVANCED_TRACKER_TRANSACTION_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataCreateClassify
  )

  const {
    getAdvancedData,
  } = useTrackerTransaction()
  const { advancedTrackerTxData, isGetAdvancedPending, refetchGetAdvancedTrackerTransaction } = getAdvancedData({
    query: queryOptions,
    fundId
  })

  const { resetData: resetCacheTodayTxs } = useUpdateModel(
    [GET_TODAY_TRANSACTION_KEY, mergeQueryParams(initQueryOptions)],
    () => { }
  )

  const { resetData: resetCacheUnclassifiedTxs } = useUpdateModel([GET_UNCLASSIFIED_TRANSACTION_KEY], () => { })
  const { resetData: resetCacheStatisticExpenditureFund } = useUpdateModel(
    [GET_STATISTIC_EXPENDITURE_FUND_KEY],
    () => { }
  )
  const { resetData: resetCacheExpenditureFund } = useUpdateModel([GET_ADVANCED_EXPENDITURE_FUND_KEY], () => { })

  const actionMap: Partial<Record<TTrackerTransactionActions, () => void>> = {
    getTransactions: resetCacheTransaction,
    getTodayTransactions: resetCacheTodayTxs,
    getUnclassifiedTransactions: resetCacheUnclassifiedTxs,
    getAllAccountSource: resetAccountSource,
    getAllTrackerTransactionType: refetchTrackerTransactionType,
    getTrackerTransaction: resetCacheTrackerTx,
    getStatisticExpenditureFund: resetCacheStatisticExpenditureFund,
    getExpenditureFund: resetCacheExpenditureFund
  }
  const callBackRefetchTrackerTransactionPage = (actionMaps: TTrackerTransactionActions[]) => {
    actionMaps.forEach((action) => {
      if (actionMap[action]) {
        actionMap[action]()
      }
    })
  }
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current
      const scrollHeight = scrollElement.scrollHeight
      const height = scrollElement.clientHeight
      const maxScrollTop = scrollHeight - height

      scrollElement.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth'
      })
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [])

  // useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (currentResponse) {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [currentResponse, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, scrollToBottom])

  useEffect(() => {
    const handleEscPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscPress)
    return () => document.removeEventListener('keydown', handleEscPress)
  }, [isOpen])

  useEffect(() => {
    const handleCtrlEnter = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        setIsOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleCtrlEnter)
    return () => document.removeEventListener('keydown', handleCtrlEnter)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const simulateTyping = (text: string, delay: number, messageId: number) => {
    return new Promise<void>((resolve) => {
      let index = 0
      clearInterval(typingInterval!)
      setIsTyping(true)

      typingInterval = setInterval(() => {
        if (index < text.length) {
          setMessages((prev) => {
            const messageIndex = prev.findIndex((msg) => msg.id === messageId)
            const updatedMessage = { ...prev[messageIndex], text: text.slice(0, index + 1) }
            return [...prev.slice(0, messageIndex), updatedMessage, ...prev.slice(messageIndex + 1)]
          })
          index++
        } else {
          clearInterval(typingInterval!)
          typingInterval = null
          setIsTyping(false)
          resolve()
        }
      }, delay)
    })
  }

  const handleStopTyping = () => {
    if (typingInterval) {
      clearInterval(typingInterval)
      typingInterval = null
    }
    setIsTyping(false)

    setMessages((prev) => {
      return prev.map((msg) => {
        if (msg.sender === 'bot' && msg.text === '') {
          return { ...msg, text: currentResponse }
        }
        return msg
      })
    })
  }

  const handleSend = async () => {
    if (!input.trim()) {
      setError('Bạn phải nhập tin nhắn trước khi gửi.')
      return;
    }

    if (typingInterval) {
      clearInterval(typingInterval)
      typingInterval = null
    }

    const newUserMessageId = Date.now()
    const newBotMessageId = Date.now() + 1

    setMessages((prev) => [
      ...prev.filter((msg) => msg.text !== ''),
      { id: newUserMessageId, text: input, sender: 'user' },
      { id: newBotMessageId, text: '', sender: 'bot' }
    ])

    setInput('')
    setError('')
    setTimeout(scrollToBottom, 100)

    try {
      const response = await fetch('https://bot.uniko.id.vn/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`
        },
        body: JSON.stringify({
          message: input,
          fundId
        })
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Response reader not available')

      let fullResponse = ''
      setIsTyping(true)

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          setIsTyping(false)
          setTimeout(scrollToBottom, 100)
          break;
        }

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('data: ').filter((line) => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            const updatedTransactions = data?.data?.transactions?.map((transaction: any) => ({
              ...transaction,
              idMessage: newBotMessageId,
              id: uuidv4()
            })) || []

            if (updatedTransactions.length > 0) {
              setTransactions((prev = []) => [...prev, ...updatedTransactions]);
            }

            const processedRecent = data.recent
              ? data.recent.replace(/\\n/g, '<br />').replace(/\\"/g, '"').replace(/\\'/g, "'")
              : '';

            fullResponse = `${data.message}\n\n${'_'.repeat(50)}\n\n${processedRecent}`;
            setCurrentResponse(fullResponse)

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === newBotMessageId
                  ? { ...msg, text: fullResponse }
                  : msg
              )
            );

            setApiData((prev = []) => [
              ...prev,
              {
                message: { id: newBotMessageId, text: fullResponse, sender: 'bot' },
                transactions: updatedTransactions
              }
            ]);

            setTimeout(scrollToBottom, 100);
          } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Problematic line:', line);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          sender: 'bot'
        }
      ]);

      setIsTyping(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleViewDetails = (transactions: Transaction[]) => {
    setSelectedTransactions(transactions)
    setIsDialogOpen(true)
  }

  const handleTypeChange = (transactionId: string, newType: any) => {
    setTypesState((prev) => ({
      ...prev,
      [transactionId]: newType
    }))
  }

  const handleStartEdit = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setEditForms((prev) => ({
      ...prev,
      [transaction.id]: {
        description: transaction.description,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        walletId: "c7909d84-dd33-4e54-bef5-3dc5cc59e684",
        categoryName: transaction.categoryName
      }
    }))
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleSaveEdit = async (transactionId: string) => {
    try {
      const currentForm = editForms[transactionId]
      if (!currentForm) return

      if (!currentForm.description || !currentForm.amount) {
        console.error('Missing required fields')
        return
      }

      const existingTransaction = selectedTransactions.find((t) => t.id === transactionId)
      console.log("🚀 ~ handleSaveEdit ~ existingTransaction:", existingTransaction)
      if (!existingTransaction) {
        console.error('No transaction found in selectedTransactions for transactionId:', transactionId)
        return
      }

      const updatedTransaction = {
        ...currentForm,
        id: transactionId,
        category: existingTransaction.category,
        wallet: existingTransaction.wallet,
        categoryName: existingTransaction.categoryName
      }

      setSelectedTransactions((prev) => {
        const updated = prev.map((t) => {
          if (t.id === transactionId) {
            return {
              ...t,
              description: currentForm.description,
              amount: currentForm.amount,
              categoryId: currentForm.categoryId,
              walletId: "c7909d84-dd33-4e54-bef5-3dc5cc59e684",
              categoryName: existingTransaction?.category?.name ?? currentForm.categoryName
            }
          }
          return t
        })

        setEditedTransactions(updated)
        return updated
      })

      setEditedTransactions((prev) => {
        const exists = prev.find((et) => et.id === transactionId)

        if (!exists) {
          const newEditedTransactions = [...prev, updatedTransaction]
          return newEditedTransactions
        }

        const updatedEditedTransactions = prev.map((et) => (et.id === transactionId ? updatedTransaction : et))

        return updatedEditedTransactions
      })

      handleCancelEdit()
    } catch (error) {
      console.error('Failed to update transaction:', error)
    }
  }

  async function postTrackerTransactions(payload: {
    trackerTypeId: any;
    reasonName: any;
    direction: any;
    amount: any;
    accountSourceId: string;
    fundId: string;
  }[]) {
    try {
      // Lặp qua từng phần tử trong payload
      for (const item of payload) {
        // Gọi API POST cho từng phần tử
        const response = await fetch('https://api.uniko.id.vn/api/tracker-transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessTokenFromLocalStorage()}` // Hàm lấy token
          },
          body: JSON.stringify(item)
        });


        // Kiểm tra phản hồi từ server
        if (!response.ok) {
          console.error(`Failed to post item: ${JSON.stringify(item)} - Status: ${response.status}`);
        } else {
          const data = await response.json();
          console.log(`Successfully posted item: ${JSON.stringify(item)} - Response: `, data);
        }
      }
      toast.success("Successfully")
      refetchGetAdvancedTrackerTransaction()
    } catch (error) {
      console.error('Error occurred while posting transactions:', error);
    }
  }

  const handleConfirm = async () => {
    const payload = editedTransactions.map((item) => {
      return {
        trackerTypeId: item.categoryId,
        reasonName: item.description,
        direction: item.type,
        amount: item.amount,
        accountSourceId: "c7909d84-dd33-4e54-bef5-3dc5cc59e684",
        fundId
      }
    })
    console.log('payload:', payload)
    postTrackerTransactions(payload) // call api
    setIsDialogOpen(false)
    setEditedTransactions([])
  }

  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -10 }
  }

  const textVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const inputVariants = {
    focus: { scale: 1.01 },
    tap: { scale: 0.99 }
  }

  useEffect(() => {
    if (dataTrackerTransactionType)
      initTrackerTypeData(dataTrackerTransactionType.data, setIncomingTrackerType, setExpenseTrackerType)
  }, [dataTrackerTransactionType])

  useEffect(() => {
    console.log("🚀 ~ ChatBox ~ apiData:", apiData)
  }, [messages]);

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <AnimatePresence mode='wait'>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
            className='flex h-[500px] w-[380px] flex-col overflow-hidden rounded-md border bg-background/95 shadow-lg backdrop-blur-md dark:bg-zinc-950/65'
          >
            <div className='relative border-b bg-primary/10 p-3 backdrop-blur-md dark:bg-slate-800/40'>
              <h2 className='text-center text-sm font-medium text-foreground dark:text-slate-100'>
                Trợ lý ảo - Uniko-chan ✨
              </h2>
              <motion.button
                className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-foreground/70 hover:bg-muted/80 dark:text-slate-100 dark:hover:bg-slate-700/50'
                onClick={() => setIsOpen(false)}
              >
                <X className='h-4 w-4' />
              </motion.button>
            </div>

            <ScrollArea
              className="h-[350px] flex-grow px-4 pt-4"
              ref={scrollRef}
            >
              <div className="flex flex-col space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                    >
                      <div
                        className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}
                      >
                        <Avatar className="h-8 w-8">
                          {message.sender === 'user' ? (
                            user?.avatarId ? (
                              <Image
                                alt="User avatar"
                                loading="lazy"
                                className="h-full w-full rounded-full object-cover"
                                src={`/avatars/${user?.avatarId}.png`}
                                width={32}
                                height={32}
                              />
                            ) : (
                              <AvatarImage src="/user-avatar.png" alt="User" />
                            )
                          ) : (
                            <AvatarImage src={AvatarUniko.src} alt="Uniko" />
                          )}
                          <AvatarFallback>
                            {message.sender === 'user' ? user?.fullName?.charAt(0) || 'U' : 'UN'}
                          </AvatarFallback>
                        </Avatar>

                        {(message.sender === 'user' || (message.sender === 'bot' && message.text)) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`max-w-[70%] overflow-hidden rounded-md px-3 py-2 text-sm ${message.sender === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                              }`}
                          >
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.1 }}
                              style={{ margin: 0 }}
                              className="prose prose-sm dark:prose-invert max-w-none"
                            >
                              {/* Hiển thị phần đầu của message */}
                              <div
                                dangerouslySetInnerHTML={{ __html: message.text.split('_'.repeat(50))[0] }}
                              />

                              {/* Kiểm tra nếu message có phân cách */}
                              {apiData.length > 0 && apiData.map((data: any) => (
                                data.message.id === message.id && data.transactions.length > 0 && (
                                  <div key={data.message.id}>
                                    <Separator className="my-4 bg-slate-200/60 dark:bg-slate-600/30" />
                                    <div className="mb-2 text-center font-semibold text-green-400">
                                      Bạn đang phân loại {data.transactions?.length ?? 0} giao dịch
                                    </div>
                                    <Button
                                      className="w-full"
                                      variant={'ghost'}
                                      onClick={() => handleViewDetails(data.transactions)}
                                    >
                                      <b className="text-red-400">Xem chi tiết</b>
                                    </Button>
                                  </div>
                                )
                              ))}
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div ref={messagesEndRef} style={{ height: '1px' }} />
              </div>
            </ScrollArea>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className='border-t bg-primary/10 p-3 pt-2 backdrop-blur-md dark:bg-slate-800/40'
            >
              {error && <p className='mb-2 text-sm font-semibold text-red-500'>{error}</p>}
              <div className='flex items-center gap-2'>
                <motion.div className='flex-grow' whileFocus={{ scale: 1.01 }} variants={inputVariants}>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Nhập tin nhắn...'
                    className='flex-grow bg-background/80 text-sm placeholder:text-muted-foreground/70 dark:bg-muted/30'
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={isTyping ? handleStopTyping : handleSend}
                    size='icon'
                    variant='default'
                    className='bg-primary/90 hover:bg-primary dark:bg-primary'
                  >
                    {isTyping ? <Square className='h-4 w-4' /> : <Send className='h-4 w-4' />}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <Button
              className='h-12 w-12 rounded-full bg-primary/90 shadow-lg hover:bg-primary dark:bg-primary'
              size='icon'
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className='h-5 w-5' />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditedTransactions([])
          }
        }}
      >
        <DialogContent className='max-w-[500px]' aria-describedby='des'>
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
          </DialogHeader>
          <DialogDescription>Uniko-chan</DialogDescription>
          <Accordion type='single' collapsible className='w-full'>
            {selectedTransactions.map((transaction: Transaction, index) => {
              const currentType = transaction.id ? typesState[transaction.id] ?? transaction.type : transaction.type
              const trackerType =
                transaction.type === ETypeOfTrackerTransactionType.INCOMING ? incomingTrackerType : expenseTrackerType
              return (
                <AccordionItem key={transaction.id} value={`item-${transaction.id}`}>
                  <AccordionTrigger className='hover:no-underline'>
                    <div className='flex w-full items-center justify-between pr-4'>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg'>{transaction.categoryName}</span>
                      </div>
                      <div
                        className={`font-medium ${transaction.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {transaction.type === 'EXPENSE' ? '-' : '+'}
                        {formatCurrency(transaction.amount ?? 0, 'VND')}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    {editingId === transaction.id ? (
                      <div className='space-y-4 p-4'>
                        <div className='grid gap-3'>
                          <div className='space-y-2'>
                            <label className='text-sm font-medium'>Tên giao dịch</label>
                            <Input
                              value={editForms[transaction.id]?.description || ''}
                              onChange={(e) =>
                                setEditForms((prev) => ({
                                  ...prev,
                                  [transaction.id]: {
                                    ...prev[transaction.id],
                                    description: e.target.value
                                  }
                                }))
                              }
                              placeholder='Nhập tên giao dịch'
                            />
                          </div>

                          <div className='space-y-2'>
                            <label className='text-sm font-medium'>Số tiền</label>
                            <Input
                              type='number'
                              value={editForms[transaction.id]?.amount || 0}
                              onChange={(e) =>
                                setEditForms((prev) => ({
                                  ...prev,
                                  [transaction.id]: {
                                    ...prev[transaction.id],
                                    amount: Number(e.target.value)
                                  }
                                }))
                              }
                              placeholder='Nhập số tiền'
                            />
                          </div>

                          <div className='space-y-2'>
                            <label className='text-sm font-medium'>Danh mục</label>
                            <Combobox
                              label='Danh mục'
                              dataArr={
                                currentType === ETypeOfTrackerTransactionType.INCOMING
                                  ? incomingTrackerType.map((item) => ({
                                    ...item,
                                    value: item.id,
                                    label: item.name
                                  }))
                                  : expenseTrackerType.map((item) => ({
                                    ...item,
                                    value: item.id,
                                    label: item.name
                                  }))
                              }
                              value={editForms[transaction.id]?.categoryId || transaction.categoryId}
                              onChange={(value: any) => {
                                setSelectedTransactions((prev) =>
                                  prev.map((item) => {
                                    if (item.id === transaction.id) {
                                      return {
                                        ...item,
                                        category: {
                                          id: value,
                                          name: trackerType.find((type) => type.id === value)?.name ?? ''
                                        }
                                      }
                                    }
                                    return item
                                  })
                                )

                                setEditForms((prev) => {
                                  const currentForm = prev[transaction.id] || {
                                    amount: transaction.amount,
                                    categoryId: transaction.categoryId,
                                    walletId: "c7909d84-dd33-4e54-bef5-3dc5cc59e684",
                                    description: transaction.description
                                  }

                                  if (currentForm.categoryId !== value) {
                                    return {
                                      ...prev,
                                      [transaction.id]: {
                                        ...currentForm,
                                        categoryId: value
                                      }
                                    }
                                  }

                                  return prev
                                })
                              }}
                              key={transaction.id}
                              setOpenEditDialog={setOpenEditTrackerTxTypeDialog}
                              dialogEdit={
                                openEditTrackerTxTypeDialog && (
                                  <EditTrackerTypeDialog
                                    openEditDialog={openEditTrackerTxTypeDialog}
                                    setOpenEditDialog={setOpenEditTrackerTxTypeDialog}
                                    dataArr={
                                      transaction.type === ETypeOfTrackerTransactionType.INCOMING
                                        ? incomingTrackerType.map((item) => ({
                                          ...item,
                                          value: item.id,
                                          label: item.name
                                        }))
                                        : expenseTrackerType.map((item) => ({
                                          ...item,
                                          value: item.id,
                                          label: item.name
                                        }))
                                    }
                                    typeDefault={ETypeOfTrackerTransactionType.INCOMING}
                                    type={currentType}
                                    setType={(newType) => handleTypeChange(transaction.id, newType)}
                                    handleCreateTrackerType={async (
                                      data: ITrackerTransactionTypeBody,
                                      setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
                                    ) => {
                                      try {
                                        await createTrackerTxType(data)
                                        setIsCreating(false)

                                        refetchTrackerTransactionType()
                                        callBackRefetchTrackerTransactionPage(typeCallBack)
                                      } catch (error) {
                                        setIsCreating(false)
                                      }
                                    }}
                                    handleUpdateTrackerType={async (data: ITrackerTransactionTypeBody) => {
                                      try {
                                        await updateTrackerTxType(data)
                                        refetchTrackerTransactionType()
                                        callBackRefetchTrackerTransactionPage(typeCallBack)
                                      } catch (error) {
                                        console.error('Error updating tracker type:', error)
                                      }
                                    }}
                                    expenditureFund={
                                      getAllExpenditureFundData?.data?.map((item) => ({
                                        value: item.id,
                                        label: item.name
                                      })) || []
                                    }
                                  />
                                )
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <label className='text-sm font-medium'>Ví</label>
                            <Select
                              value={
                                editForms[transaction.id]?.walletId === 'default'
                                  ? getAllAccountSourceData?.data[0]?.id || ''
                                  : editForms[transaction.id]?.walletId
                              }
                              onValueChange={(value) => {
                                setEditForms((prev) => ({
                                  ...prev,
                                  [transaction.id]: {
                                    ...prev[transaction.id],
                                    walletId: value
                                  }
                                }))

                                setSelectedTransactions((prev) =>
                                  prev.map((item) =>
                                    item.id === transaction.id
                                      ? {
                                        ...item,
                                        wallet: {
                                          ...item.wallet,
                                          id: value,
                                          name:
                                            getAllAccountSourceData?.data?.find((account) => account.id === value)
                                              ?.name || item.walletName,
                                          currentAmount:
                                            getAllAccountSourceData?.data?.find((account) => account.id === value)
                                              ?.currentAmount || item.wallet.currentAmount
                                        }
                                      }
                                      : item
                                  )
                                )
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={getAllAccountSourceData?.data[0].name} />
                              </SelectTrigger>
                              <SelectContent>
                                {getAllAccountSourceData?.data?.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name} - {account.currentAmount} {account.currency}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className='flex items-center justify-end gap-2'>
                          <Button variant='outline' size='sm' onClick={handleCancelEdit}>
                            <X className='mr-2 h-4 w-4' />
                            Hủy
                          </Button>
                          <Button size='sm' onClick={() => handleSaveEdit(transaction.id)}>
                            <Check className='mr-2 h-4 w-4' />
                            Lưu
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className='space-y-4 p-4'>
                        <div className='grid gap-2 text-sm'>
                          <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground'>Danh mục:</span>
                            <span className='rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800'>
                              {transaction.categoryName}
                            </span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground'>Ví:</span>
                            <span>{transaction?.walletName ?? ''}</span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground'>Loại:</span>
                            <span>{transaction.type === 'EXPENSE' ? 'Chi tiêu' : 'Thu nhập'}</span>
                          </div>
                        </div>
                        <div className='flex justify-end'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='gap-2'
                            onClick={() => handleStartEdit(transaction)}
                          >
                            <Pencil className='h-4 w-4' />
                            Chỉnh sửa
                          </Button>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
          <DialogFooter className='mt-4 flex items-center justify-between border-t pt-4'>
            <div className='text-sm text-muted-foreground'>
              {editedTransactions.length > 0
                ? `Đã chỉnh sửa ${editedTransactions.length} giao dịch`
                : 'Chưa có thay đổi nào'}
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Đóng
              </Button>
              <Button onClick={handleConfirm} disabled={editedTransactions.length === 0}>
                Xác nhận thay đổi
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
