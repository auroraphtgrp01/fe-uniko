'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import HeroSection from '@/components/homepage/HeroSection'
import ContributorsSection from '@/components/homepage/ContributorsSection'
import { Spotlight } from '@/components/homepage/Spotlight'
import Navbar from '@/components/homepage/Navbar'
import AvatarTuan from '@/images/contributors/Tuan.jpg'
import AvatarKhanh from '@/images/contributors/Khanh.jpg'
import AvatarHuy from '@/images/contributors/Huy.jpg'
import AvatarThanh from '@/images/contributors/Thanh.jpg'
import AvatarTrong from '@/images/contributors/Trong.jpg'
import { BentoGridThird } from '@/components/homepage/Grid'
import { MarqueeReview } from '@/components/homepage/Marquee'

export default function MainSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const contributors = [
    {
      name: 'Le Minh Tuan',
      role: 'Lead Developer',
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
    { name: 'Nguyen Quang Huy', role: 'Frontend Developer', image: AvatarHuy, srcGit: 'https://github.com/kwanghy2303' }
  ]

  return (
    <div
      ref={containerRef}
      className='relative w-full bg-white bg-gradient-to-r from-rose-50/80 via-white to-rose-50/80 dark:bg-black dark:from-rose-950/50 dark:via-slate-900 dark:to-rose-950/50 dark:bg-grid-white/[0.05]'
    >
      <Navbar />
      <div className='fixed inset-0 overflow-hidden'>
        <Spotlight className='-top-40 left-0 md:-top-20 md:left-60' fill='white' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.05),transparent_90%)]' />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className='absolute h-2 w-2 rounded-full bg-rose-300 dark:bg-rose-400/30'
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1.2, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div
        className='fixed inset-0'
        style={{
          backgroundImage:
            'linear-gradient(rgba(244, 63, 94, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 63, 94, 0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className='relative z-10'>
        <div id='hero'>
          <HeroSection />
        </div>
        <div>
          <div className='absolute -mt-32 opacity-0' id='overview'></div>
          <BentoGridThird />
        </div>
        <div className=''>
          {/* <div className='absolute -mt-32 scroll-mt-32 opacity-0' id='features'></div> */}
          {/* <FeatureTabs /> */}
          <MarqueeReview />
        </div>
        <div id='contributors'>
          <ContributorsSection contributors={contributors} />
        </div>
      </div>
    </div>
  )
}
