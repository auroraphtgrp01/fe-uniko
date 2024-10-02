'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { Spotlight } from '@/components/homepage/Spotlight'
import { HoverBorderGradient } from '@/components/homepage/HoverBorderGradient'
import Heading1 from '@/components/homepage/Heading1'
import AnimElement from '@/components/homepage/AnimElement'
import Link from 'next/link'
import '@/styles/hero.css'
import logoImg from '@/images/logo-3.png'
import { motion } from 'framer-motion'
import { isLogin } from '@/libraries/helpers'
import { FlipWords } from '@/components/dashboard/flip-words'

export default function HeroSection() {
  const isLoginUser = isLogin()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])
  return (
    <div id='hero' className='hero flex min-h-screen items-center justify-center'>
      <div className='relative flex w-full items-center justify-center bg-black bg-grid-small-white/[0.2]'>
        <Spotlight className='left-0 top-40 md:-top-20 md:left-60' fill='white' />

        <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'></div>
        <div className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center p-4 pt-20 md:pt-0'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: 'easeOut', delay: 1.1, duration: 1 }}
          >
            <Image src={logoImg} width={200} alt='' className='mb-8' />
          </motion.div>
          <Heading1 delay={1} duration={6} className='text-center'>
            <span className={`font-semibold tracking-tighter`}>{'Optimized financial solutions'}</span>
            <br />
            <span className={`font-semibold leading-snug tracking-tighter`}>
              for{' '}
              <FlipWords
                className='font-semibold leading-snug tracking-tighter'
                duration={3000}
                words={['lasting success', 'future development']}
              ></FlipWords>
            </span>
          </Heading1>
          <AnimElement>
            <p
              className={`text-para1 mx-auto mt-4 max-w-lg text-center text-sm font-normal tracking-tighter text-gray-400 lg:text-lg`}
            >
              The open-source financial management software that helps you manage your finances with ease.
              <p>Author: Le Minh Tuan</p>
              {isLoginUser !== null ? <p className='mt-4'>Welcome back, {isLoginUser?.fullName}</p> : null}
            </p>
            <div className='mt-5 flex justify-center'>
              <HoverBorderGradient
                containerClassName='rounded-xl'
                as='button'
                className='flex items-center space-x-2 bg-black text-white'
              >
                {isLoginUser !== null ? (
                  <div>
                    <Link className='no-underline' href='/dashboard'>
                      <span>Go to Dashboard</span>
                    </Link>
                  </div>
                ) : (
                  <Link className='no-underline' href='/sign-in'>
                    <span>Get Started</span>
                  </Link>
                )}
              </HoverBorderGradient>
            </div>
          </AnimElement>
        </div>
      </div>
    </div>
  )
}
