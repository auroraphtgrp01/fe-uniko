'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, X, MessageCircle, Square, Pencil } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AvatarUniko from '@/images/avatar.jpg'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { formatCurrency } from '@/libraries/utils'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

interface ChatResponse {
  messages: string
  recent: string
  transactions: any[]
  statistics: {
    total_expense: number
    total_income: number
    transaction_count: number
    categories: any
  }
}

export function ChatBox() {
  const { user } = useStoreLocal()
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
  const [editForms, setEditForms] = useState<{
    [key: string]: {
      item: string
      amount: number
      categoryId: string
      walletId: string
    }
  }>({})
  const [editedTransactions, setEditedTransactions] = useState<any[]>([])

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
    if (input.trim()) {
      if (typingInterval) {
        clearInterval(typingInterval)
        typingInterval = null
      }

      const newUserMessageId = Date.now()
      const newBotMessageId = Date.now() + 1

      setMessages((prev) => prev.filter((msg) => msg.text !== ''))
      setMessages((prev) => [...prev, { id: newUserMessageId, text: input, sender: 'user' }])
      setMessages((prev) => [...prev, { id: newBotMessageId, text: '', sender: 'bot' }])
      setInput('')
      setError('')

      setTimeout(scrollToBottom, 100)

      try {
        const response = await fetch('https://bot.uniko.id.vn/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: input
          })
        })

        if (!response.ok) throw new Error('Network response was not ok')

        const reader = response.body?.getReader()
        if (!reader) throw new Error('Reader not available')

        let fullResponse = ''
        setIsTyping(true)

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            setIsTyping(false)
            setTimeout(scrollToBottom, 100)
            break
          }

          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('data: ').filter((line) => line.trim())

          for (const line of lines) {
            try {
              const data = JSON.parse(line)
              if (data.done) {
                setTransactions(data.transactions)
                setTimeout(scrollToBottom, 100)
              }

              if (data.type === 'message') {
                const processedRecent = data.recent.replace(/\\n/g, '<br />').replace(/\\"/g, '"').replace(/\\'/g, "'")

                const combinedMessage = `${data.messages}\n\n${'_'.repeat(50)}\n\n${processedRecent}`

                fullResponse = combinedMessage
                setCurrentResponse(fullResponse)

                setMessages((prev) => {
                  const newMessages = prev.map((msg) => {
                    if (msg.id === newBotMessageId) {
                      return {
                        ...msg,
                        text: `${data.messages}\n\n${'_'.repeat(50)}\n\n${processedRecent}`
                      }
                    }
                    return msg
                  })
                  setTimeout(scrollToBottom, 100)
                  return newMessages
                })

                await new Promise((resolve) => setTimeout(resolve, 10))
              }
            } catch (e) {
              console.error('Error parsing JSON:', e)
              console.log('Problematic line:', line)
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
            sender: 'bot'
          }
        ])
        setIsTyping(false)
        setTimeout(scrollToBottom, 100)
      }
    } else {
      setError('Bạn phải nhập tin nhắn trước khi gửi.')
    }
  }

  const handleViewDetails = (transactions: any[]) => {
    setSelectedTransactions(transactions)
    setIsDialogOpen(true)
  }

  const handleStartEdit = (transaction: any) => {
    setEditingId(transaction.id)
    setEditForms((prev) => ({
      ...prev,
      [transaction.id]: {
        item: transaction.item,
        amount: transaction.amount,
        categoryId: transaction.category.id,
        walletId: transaction.wallet.id
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

      if (!currentForm.item || !currentForm.amount) {
        console.error('Missing required fields')
        return
      }

      const updatedTransaction = {
        ...currentForm,
        id: transactionId,
        category: selectedTransactions.find((t) => t.id === transactionId)?.category,
        wallet: selectedTransactions.find((t) => t.id === transactionId)?.wallet
      }

      setSelectedTransactions((prev) =>
        prev.map((t) => {
          if (t.id === transactionId) {
            return {
              ...t,
              item: currentForm.item,
              amount: currentForm.amount,
              category: { ...t.category, id: currentForm.categoryId },
              wallet: { ...t.wallet, id: currentForm.walletId }
            }
          }
          return t
        })
      )

      setEditedTransactions((prev) => {
        const exists = prev.find((et) => et.id === transactionId)
        if (!exists) {
          return [...prev, updatedTransaction]
        }
        return prev.map((et) => (et.id === transactionId ? updatedTransaction : et))
      })

      handleCancelEdit()
    } catch (error) {
      console.error('Failed to update transaction:', error)
    }
  }

  const handleConfirm = () => {
    console.log('Các giao dịch đã được chỉnh sửa:', editedTransactions)
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

  return (
    <div className='fixed bottom-4 right-4'>
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
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial='initial'
                      animate='animate'
                      exit='exit'
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                    >
                      <div
                        className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}
                      >
                        <Avatar className='h-8 w-8'>
                          {message.sender === 'user' ? (
                            user?.avatarId ? (
                              <Image
                                alt='User avatar'
                                loading='lazy'
                                className='h-full w-full rounded-full object-cover'
                                src={`/avatars/${user?.avatarId}.png`}
                                width={32}
                                height={32}
                              />
                            ) : (
                              <AvatarImage src='/user-avatar.png' alt='User' />
                            )
                          ) : (
                            <AvatarImage src={AvatarUniko.src} alt='Uniko' />
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
                            className={`max-w-[70%] overflow-hidden rounded-md px-3 py-2 text-sm ${
                              message.sender === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.1 }}
                              style={{ margin: 0 }}
                              className='prose prose-sm dark:prose-invert max-w-none'
                            >
                              <div className=''>{message.text.split('_'.repeat(50))[0]}</div>

                              {message.text.includes('_'.repeat(50)) &&
                                message.text.split('_'.repeat(50))[1].trim() && (
                                  <>
                                    <Separator className='my-4 bg-slate-200/60 dark:bg-slate-600/30' />
                                    {transactions.length <= 1 ? (
                                      <div
                                        className='mt-2'
                                        dangerouslySetInnerHTML={{ __html: message.text.split('_'.repeat(50))[1] }}
                                      />
                                    ) : (
                                      <div className='mb-2 text-center font-semibold text-green-400'>
                                        Bạn đang phân loại {transactions.length} giao dịch
                                      </div>
                                    )}
                                    <Button
                                      className='w-full'
                                      variant={'ghost'}
                                      onClick={() => handleViewDetails(transactions)}
                                    >
                                      <b className='text-red-400'>Xem chi tiết</b>
                                    </Button>
                                  </>
                                )}
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
        <DialogContent className='max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
          </DialogHeader>

          <Accordion type='single' collapsible className='w-full'>
            {selectedTransactions.map((transaction, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className='hover:no-underline'>
                  <div className='flex w-full items-center justify-between pr-4'>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg'>{transaction.category.name.split(' ')[0]}</span>
                      <span className='font-medium'>{transaction.item}</span>
                    </div>
                    <div
                      className={`font-medium ${transaction.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {transaction.type === 'EXPENSE' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
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
                            value={editForms[transaction.id]?.item || ''}
                            onChange={(e) =>
                              setEditForms((prev) => ({
                                ...prev,
                                [transaction.id]: {
                                  ...prev[transaction.id],
                                  item: e.target.value
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
                          <Select
                            value={editForms[transaction.id]?.categoryId || ''}
                            onValueChange={(value) =>
                              setEditForms((prev) => ({
                                ...prev,
                                [transaction.id]: {
                                  ...prev[transaction.id],
                                  categoryId: value
                                }
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn danh mục' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={transaction.category.id}>{transaction.category.name}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className='space-y-2'>
                          <label className='text-sm font-medium'>Ví</label>
                          <Select
                            value={editForms[transaction.id]?.walletId || ''}
                            onValueChange={(value) =>
                              setEditForms((prev) => ({
                                ...prev,
                                [transaction.id]: {
                                  ...prev[transaction.id],
                                  walletId: value
                                }
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn ví' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={transaction.wallet.id}>{transaction.wallet.name}</SelectItem>
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
                            {transaction.category.name}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground'>Ví:</span>
                          <span>{transaction.wallet.name}</span>
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
            ))}
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
