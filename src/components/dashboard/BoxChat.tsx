'use client'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, X, MessageCircle, Square } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AvatarUniko from '@/images/avatar.jpg'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import Image from 'next/image'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Separator } from "@/components/ui/separator"

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

interface ChatResponse {
  messages: string;
  recent: string;
  transactions: any[];
  statistics: {
    total_expense: number;
    total_income: number;
    transaction_count: number;
    categories: any;
  };
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
  let typingInterval: NodeJS.Timeout | null = null;
  const [isTyping, setIsTyping] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<string>('');

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

  const simulateTyping = (text: string, delay: number, messageId: number) => {
    return new Promise<void>((resolve) => {
      let index = 0;
      clearInterval(typingInterval!);
      setIsTyping(true);

      typingInterval = setInterval(() => {
        if (index < text.length) {
          setMessages((prev) => {
            const messageIndex = prev.findIndex(msg => msg.id === messageId);
            const updatedMessage = { ...prev[messageIndex], text: text.slice(0, index + 1) };
            return [
              ...prev.slice(0, messageIndex),
              updatedMessage,
              ...prev.slice(messageIndex + 1)
            ];
          });
          index++;
        } else {
          clearInterval(typingInterval!);
          typingInterval = null;
          setIsTyping(false);
          resolve();
        }
      }, delay);
    });
  };

  const handleStopTyping = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
    setIsTyping(false);

    // Cập nhật tin nhắn với nội dung hiện tại
    setMessages(prev => {
      return prev.map(msg => {
        if (msg.sender === 'bot' && msg.text === '') {
          return { ...msg, text: currentResponse };
        }
        return msg;
      });
    });
  };

  const handleSend = async () => {
    if (input.trim()) {
      if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
      }

      setMessages(prev => prev.filter(msg => msg.text !== ''));
      setMessages(prev => [...prev, { id: prev.length + 1, text: input, sender: 'user' }]);
      const botMessageId = messages.length + 2;
      setMessages(prev => [...prev, { id: botMessageId, text: '', sender: 'bot' }]);
      setInput('');
      setError('');

      try {
        const response = await fetch('http://localhost:8000/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: input
          })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Reader not available');

        let fullResponse = '';
        setIsTyping(true);

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setIsTyping(false);
            break;
          }

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('data: ').filter(line => line.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.type === 'message') {
                // Combine messages và recent với một dòng phân cách
                const processedRecent = data.recent
                  .replace(/\\n/g, '<br />')  // Chuyển \\n thành <br />
                  .replace(/\\"/g, '"')       // Chuyển \\" thành "
                  .replace(/\\'/g, "'");      // Chuyển \\' thành '

                const combinedMessage = `${data.messages}\n\n${'_'.repeat(50)}\n\n${processedRecent}`;

                fullResponse = combinedMessage;
                setCurrentResponse(fullResponse);

                setMessages(prev => {
                  return prev.map(msg => {
                    if (msg.id === botMessageId) {
                      return {
                        ...msg,
                        text: `${data.messages}\n\n${'_'.repeat(50)}\n\n${processedRecent}`
                      };
                    }
                    return msg;
                  });
                });

                await new Promise(resolve => setTimeout(resolve, 10));
              }
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
            id: prev.length + 1,
            text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
            sender: 'bot'
          }
        ]);
        setIsTyping(false);
      }
    } else {
      setError('Bạn phải nhập tin nhắn trước khi gửi.');
    }
  };

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
                              <div className="">
                                {message.text.split('_'.repeat(50))[0]}
                              </div>

                              {message.text.includes('_'.repeat(50)) && (
                                <>
                                  <Separator className="my-4 bg-slate-200/60 dark:bg-slate-600/30" />
                                  <div className="mt-2"
                                    dangerouslySetInnerHTML={{ __html: message.text.split('_'.repeat(50))[1] }} />
                                </>
                              )}
                            </motion.div>
                          </motion.div>
                        )}
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
                    onClick={isTyping ? handleStopTyping : handleSend}
                    size='icon'
                    variant='default'
                    className='bg-primary/90 hover:bg-primary dark:bg-primary'
                  >
                    {isTyping ? (
                      <Square className='h-4 w-4' />
                    ) : (
                      <Send className='h-4 w-4' />
                    )}
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
