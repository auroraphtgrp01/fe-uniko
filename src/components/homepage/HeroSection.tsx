'use client'

import { motion } from 'framer-motion'
import { Github, ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FlipWords } from '@/components/dashboard/flip-words'
import Link from 'next/link'
import { isLogin } from '@/libraries/helpers'
import Image from 'next/image'
import Logo2 from '@/images/logo-2.png'

export default function HeroSection() {
  const isLoginUser = isLogin()

  return (
    <section className='relative min-h-screen overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 bg-gradient-to-b from-rose-50/50 to-slate-50/50 dark:from-rose-950/30 dark:to-slate-950/30' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.1),transparent_70%)]' />

      <div className='relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center'>
        {/* Logo & Title Animation */}
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className='mb-8 transform'
        >
          <div className='group flex items-center justify-center space-x-3'>
            <div className='relative'>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <Image
                  src={Logo2}
                  alt='Logo'
                  width={60}
                  height={60}
                  priority
                  className='rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-rose-200 dark:group-hover:shadow-rose-900'
                />
              </motion.div>
              <motion.div
                className='absolute -inset-1 -z-10 rounded-xl bg-gradient-to-r from-rose-400 to-red-600 opacity-40 blur-lg transition-all duration-300 group-hover:opacity-70'
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              />
            </div>
            <h1 className='text-3xl font-bold text-violet-700 dark:text-white md:text-4xl'>UNIKO</h1>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='relative max-w-4xl space-y-6'
        >
          <h2 className='text-2xl font-bold leading-tight sm:text-4xl md:text-5xl'>
            <span className='block text-violet-700 dark:text-white'>Giải pháp tối ưu về quản lý tài chính</span>
            <FlipWords
              className='mt-2 font-semibold leading-snug tracking-tight text-violet-700 dark:text-white'
              duration={4000}
              words={['thành công bền vững ✨', 'phát triển tương lai', 'làm chủ tài chính']}
            />
          </h2>

          <p className='mx-auto max-w-2xl text-base text-violet-700/90 dark:text-white/90 sm:text-lg md:text-xl'>
            UNIKO - Phần mềm quản lý tài chính thế hệ mới giúp bạn theo dõi, quản lý và tối ưu hóa tài chính một cách
            thông minh và hiệu quả.
          </p>

          <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {[
              {
                icon: <Sparkles className='h-5 w-5 text-rose-500' />,
                text: 'Quản lý thông minh'
              },
              {
                icon: <TrendingUp className='h-5 w-5 text-rose-500' />,
                text: 'Phân tích chuyên sâu'
              },
              {
                icon: <Shield className='h-5 w-5 text-rose-500' />,
                text: 'Bảo mật tuyệt đối'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className='flex items-center justify-center space-x-2 rounded-full bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm dark:bg-white/10'
              >
                {feature.icon}
                <span className='text-sm font-medium text-violet-700 dark:text-white'>{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Author & Welcome */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className='mt-6 text-sm font-medium text-violet-700/90 dark:text-white/90'
          >
            <span className='inline-flex items-center space-x-1'>
              <span>Created with</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className='text-rose-500'
              >
                ❤️
              </motion.span>
              <span>by Le Minh Tuan</span>
            </span>
            {isLoginUser && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='mt-2 text-white'>
                Welcome back, {isLoginUser.fullName}! ✨
              </motion.p>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className='mt-8 flex w-full max-w-md flex-col items-center justify-center gap-4 sm:mx-auto sm:flex-row'
          >
            {isLoginUser ? (
              <Link className='group relative z-10 w-full sm:w-auto' href='/dashboard/tracker-transaction'>
                <Button className='relative w-full overflow-hidden bg-rose-500 text-white transition-all duration-300 hover:bg-rose-600'>
                  <span className='relative z-10'>Dashboard</span>
                  <motion.div
                    className='absolute inset-0 -z-0 bg-gradient-to-r from-rose-600 to-red-600'
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                  <ArrowRight className='relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Button>
              </Link>
            ) : (
              <Link className='group relative z-10 w-full sm:w-auto' href='/sign-in'>
                <Button className='relative w-full overflow-hidden bg-rose-500 text-white transition-all duration-300 hover:bg-rose-600'>
                  <span className='relative z-10'>Get Started</span>
                  <motion.div
                    className='absolute inset-0 -z-0 bg-gradient-to-r from-rose-600 to-red-600'
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                  <ArrowRight className='relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Button>
              </Link>
            )}

            <a
              href='https://github.com/auroraphtgrp01/fe-uniko'
              className='group w-full sm:w-auto'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                variant='outline'
                className='w-full border-rose-200 bg-white/50 text-rose-600 backdrop-blur-sm transition-all duration-300 hover:border-rose-400 hover:bg-rose-50 dark:border-rose-800 dark:bg-white/5 dark:text-rose-400 dark:hover:border-rose-600 dark:hover:bg-rose-950/50'
              >
                <Github className='mr-2 h-4 w-4 transition-transform group-hover:rotate-12' />
                View on GitHub
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
