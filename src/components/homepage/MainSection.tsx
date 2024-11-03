'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import HeroSection from '@/components/homepage/HeroSection'
import ContributorsSection from '@/components/homepage/ContributorsSection'
import { Spotlight } from '@/components/homepage/Spotlight'
import AvatarTuan from '@/images/contributors/Tuan.jpg'
import AvatarKhanh from '@/images/contributors/Khanh.jpg'
import AvatarHuy from '@/images/contributors/Huy.jpg'
import AvatarThanh from '@/images/contributors/Thanh.jpg'
import AvatarTrong from '@/images/contributors/Trong.jpg'

export default function MainSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const contributors = [
    { name: 'Le Minh Tuan', role: 'Lead Developer', image: AvatarTuan, srcGit: 'https://github.com/auroraphtgrp01' },
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
    <div ref={containerRef} className='relative bg-black'>
      {/* Animated background */}
      <div className='fixed inset-0 overflow-hidden'>
        <Spotlight className='left-0 top-40 md:-top-20 md:left-60' fill='white' />

        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_70%)]' />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className='absolute h-2 w-2 rounded-full bg-red-500/20'
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className='fixed inset-0'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main content */}
      <div className='relative z-10'>
        <HeroSection />
        <ContributorsSection contributors={contributors} />
      </div>
    </div>
  )
}
