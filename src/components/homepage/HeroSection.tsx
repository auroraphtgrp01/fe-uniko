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
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 1 }}
        className='mb-12'
      >
        <div className='flex items-center justify-center space-x-2'>
          <Boxes className='h-12 w-12 text-red-500' />
          <h1 className='text-4xl font-bold text-red-500'>UNIKO</h1>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='max-w-4xl space-y-6'
      >
        <h2 className='text-4xl font-bold leading-tight text-white sm:text-6xl'>
          <span className='inline-block bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent'>
            Optimized financial solutions
          </span>
          <br />
          <FlipWords
            className='font-semibold leading-snug tracking-tighter'
            duration={3000}
            words={['lasting success', 'future development']}
          ></FlipWords>
        </h2>
        <p className='mx-auto max-w-2xl text-lg text-gray-400'>
          The open-source financial management software that helps you manage your finances with ease.
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

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className='mt-20 grid gap-8 sm:grid-cols-2 md:grid-cols-3'
      >
        {[
          {
            icon: <Boxes className='h-6 w-6' />,
            title: 'Open Source',
            description: 'Community-driven and transparent, built for trust and collaboration.'
          },
          {
            icon: <Sparkles className='h-6 w-6' />,
            title: 'Automated Tracking',
            description: 'Automatically organizes and tracks your finances for easy management.'
          },
          {
            icon: <Sparkles className='h-6 w-6' />,
            title: 'Goal-Oriented Budgeting',
            description: 'Set and track financial goals with tools designed for success.'
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
