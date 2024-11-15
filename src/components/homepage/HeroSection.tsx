'use client'

import { motion } from 'framer-motion'
import { Github, ArrowRight, Sparkles, Boxes } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FlipWords } from '@/components/dashboard/flip-words'
import Link from 'next/link'
import { isLogin } from '@/libraries/helpers'

export default function HeroSection() {
  const isLoginUser = isLogin()
  return (
    <section className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
      {/* Logo - Prioritized */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className='mb-12'
      >
        <div className='flex items-center justify-center space-x-2'>
          <Boxes className='h-12 w-12 text-red-500' />
          <h1 className='text-4xl font-bold text-red-500'>
            UNIKO
            <span className='sr-only'>- Giải Pháp Quản Lý Tài Chính Thông Minh</span>
          </h1>
        </div>
      </motion.div>

      {/* Headline - Optimized for LCP and SEO */}
      <motion.div
        initial={{ opacity: 0.8, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='max-w-4xl space-y-6'
      >
        <h2 className='text-4xl font-bold leading-tight text-white sm:text-6xl'>
          <span className='inline-block bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent'>
            Giải pháp tối ưu về quản lý tài chính
          </span>
          <br />
          <FlipWords
            className='font-semibold leading-snug tracking-tighter'
            duration={4000}
            words={['thành công bền vững', 'phát triển tương lai']}
          ></FlipWords>
        </h2>
        <p className='mx-auto max-w-2xl text-lg text-gray-400'>
          UNIKO - Phần mềm quản lý tài chính mã nguồn mở giúp bạn theo dõi, quản lý và tối ưu hóa tài chính một cách dễ
          dàng và hiệu quả.
        </p>
      </motion.div>

      {/* Author */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className='mt-4 text-sm text-gray-500'
      >
        Author: Le Minh Tuan
        {isLoginUser !== null ? <p className='mt-4'>Welcome back, {isLoginUser?.fullName}</p> : null}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='mt-8 flex flex-wrap items-center justify-center gap-4'
      >
        {isLoginUser !== null ? (
          <Link className='relative z-10 no-underline' href='/dashboard/tracker-transaction'>
            <Button size='lg' className='group relative overflow-hidden bg-red-500 text-white hover:bg-red-600'>
              <span>Go to Dashboard</span>
              <motion.div
                className='absolute inset-0 z-0 bg-gradient-to-r from-rose-500 to-red-500'
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
              <ArrowRight className='relative z-10 ml-2 h-4 w-4' />
            </Button>
          </Link>
        ) : (
          <Link className='no-underline' href='/sign-in'>
            <Button size='lg' className='group relative overflow-hidden bg-red-500 text-white hover:bg-red-600'>
              <span>Get Started</span>
              <motion.div
                className='absolute inset-0 z-0 bg-gradient-to-r from-rose-500 to-red-500'
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
              <ArrowRight className='relative z-10 ml-2 h-4 w-4' />
            </Button>
          </Link>
        )}

        <Button
          size='lg'
          variant='outline'
          className='group border-red-500/20 text-red-500 hover:border-red-500/40 hover:bg-red-500/10'
        >
          <Github className='mr-2 h-4 w-4' />
          <a href='https://github.com/auroraphtgrp01/fe-uniko'>View on GitHub</a>
        </Button>
      </motion.div>

      {/* Features - SEO Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className='mt-20 grid gap-8 sm:grid-cols-2 md:grid-cols-3'
      >
        {[
          {
            icon: <Boxes className='h-6 w-6' />,
            title: 'Quản Lý Tài Chính Thông Minh',
            description: 'Giải pháp toàn diện cho việc theo dõi và quản lý tài chính cá nhân.'
          },
          {
            icon: <Sparkles className='h-6 w-6' />,
            title: 'Theo Dõi Tự Động',
            description: 'Tự động hóa việc tổ chức và theo dõi tài chính của bạn.'
          },
          {
            icon: <Sparkles className='h-6 w-6' />,
            title: 'Lập Kế Hoạch Tài Chính',
            description: 'Thiết lập và theo dõi mục tiêu tài chính với công cụ chuyên nghiệp.'
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className='group relative rounded-xl border border-red-500/10 bg-black/50 p-6 backdrop-blur-sm'
            whileHover={{ scale: 1.05 }}
          >
            <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/5 to-transparent' />
            <div className='relative space-y-2'>
              <div className='text-red-500'>{feature.icon}</div>
              <h3 className='text-lg font-semibold text-white'>{feature.title}</h3>
              <p className='text-sm text-gray-400'>{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
