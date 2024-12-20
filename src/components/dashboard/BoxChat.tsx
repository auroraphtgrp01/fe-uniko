'use client'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, X, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AvatarUniko from '@/images/avatar.jpg'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import Image from 'next/image'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export function ChatBox() {
  const { user } = useStoreLocal()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Xin chào! Tôi có thể giúp gì cho bạn?', sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
          })
        }
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [isOpen])

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: 'user' }])
      setInput('')
      setError('')
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.', sender: 'bot' }
        ])
      }, 1000)
    } else {
      setError('Bạn phải nhập tin nhắn trước khi gửi.')
    }
  }

  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -10 }
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

            <ScrollArea className='h-[350px] flex-grow px-4 pt-4'>
              <div ref={scrollRef}>
                <AnimatePresence mode='popLayout'>
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
                        <div
                          className={`max-w-[70%] rounded-md px-3 py-2 text-sm ${
                            message.sender === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <p>{message.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
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
                    onClick={handleSend}
                    size='icon'
                    variant='default'
                    className='bg-primary/90 hover:bg-primary dark:bg-primary'
                  >
                    <Send className='h-4 w-4' />
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
    </div>
  )
}
