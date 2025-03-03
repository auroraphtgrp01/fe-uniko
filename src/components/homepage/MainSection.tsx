'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import HeroSection from '@/components/homepage/HeroSection'
import ContributorsSection from '@/components/homepage/ContributorsSection'
import { Spotlight } from '@/components/homepage/Spotlight'
import Navbar from '@/components/homepage/Navbar'
import AvatarTuan from '@/images/contributors/Tuan.jpg'
import AvatarKhanh from '@/images/contributors/Khanh.jpg'
import AvatarHuy from '@/images/contributors/Huy.jpg'
import AvatarThanh from '@/images/contributors/Thanh.jpg'
import AvatarTrong from '@/images/contributors/Trong.jpg'
import AvatarTriet from '@/images/contributors/Triet.jpg'
import { BentoGridThird } from '@/components/homepage/Grid'
import { MarqueeReview } from '@/components/homepage/Marquee'
import { PlatformSection } from '@/components/homepage/PlatformSection'
import { Metadata } from 'next'
import Head from 'next/head'
// import { IPhoneDemo } from '@/components/homepage/IPhoneDemo'

export const metadata: Metadata = {
  title: 'UNIKO - Giải pháp quản lý tài chính thông minh',
  description: 'UNIKO - Phần mềm quản lý tài chính thế hệ mới giúp bạn theo dõi, quản lý và tối ưu hóa tài chính một cách thông minh và hiệu quả.',
  keywords: 'quản lý tài chính, phần mềm tài chính, tài chính cá nhân, quản lý chi tiêu',
  openGraph: {
    title: 'UNIKO - Giải pháp quản lý tài chính thông minh',
    description: 'UNIKO - Phần mềm quản lý tài chính thế hệ mới giúp bạn theo dõi, quản lý và tối ưu hóa tài chính một cách thông minh và hiệu quả.',
    images: ['/og-image.jpg'],
  },
}

export default function MainSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const contributors = [
    {
      name: 'Le Minh Tuan',
      role: 'Founder & Leader Developer',
      image: AvatarTuan,
      srcGit: 'https://github.com/auroraphtgrp01',
      priority: true
    },
    {
      name: 'Tran Nguyen Duy Khanh',
      role: 'Fullstack Developer',
      image: AvatarKhanh,
      srcGit: 'https://github.com/AugustusDngQt'
    },
    {
      name: 'Ho Thi Thanh Thanh',
      role: 'Frontend Developer',
      image: AvatarThanh,
      srcGit: 'https://github.com/ThanhkThanh'
    },
    {
      name: 'Doan Vo Van Trong',
      role: 'Frontend Developer',
      image: AvatarTrong,
      srcGit: 'https://github.com/vantrong2405'
    },
    {
      name: 'Pham Minh Triet',
      role: 'Mobile Developer',
      image: AvatarTriet,
      srcGit: 'https://github.com/pmtriet'
    },
    { name: 'Nguyen Quang Huy', role: 'Frontend Developer', image: AvatarHuy, srcGit: 'https://github.com/kwanghy2303' }
  ]

  return (
    <>
      <div id='home'
        ref={containerRef}
        className='relative w-full select-none bg-white bg-gradient-to-r from-rose-50/80 via-white to-rose-50/80 dark:bg-black dark:from-rose-950/50 dark:via-slate-900 dark:to-rose-950/50 dark:bg-grid-white/[0.05]'
      >
        <Navbar />
        <motion.div
          className='fixed inset-0 overflow-hidden'
          style={{ opacity }}
        >
          <Spotlight className='-top-40 left-0 md:-top-20 md:left-60' fill='white' />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.08),transparent_90%)]' />
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className='absolute h-2 w-2 rounded-full bg-rose-300/50 dark:bg-rose-400/40 backdrop-blur-sm'
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>

        <div
          className='fixed inset-0'
          style={{
            backgroundImage:
              'linear-gradient(rgba(244, 63, 94, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 63, 94, 0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className='relative z-10'>
          <motion.div
            id='hero'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroSection />
          </motion.div>

          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 py-16'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className='absolute -mt-32 opacity-0' id='overview'></div>
              <BentoGridThird />
            </motion.div>

            <motion.div
              id='platform'
              className='w-full'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <PlatformSection />
            </motion.div>

            <motion.div
              className='w-full'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <MarqueeReview />
            </motion.div>

            <motion.div
              id='contributors'
              className='w-full'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <ContributorsSection contributors={contributors} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
