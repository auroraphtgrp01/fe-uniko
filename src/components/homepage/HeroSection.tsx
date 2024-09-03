'use client'
import React, { useEffect } from 'react'
import ListViewImage from '@/images/list-view.png'
import Image from 'next/image'
import { Spotlight } from '@/components/homepage/Spotlight'
import { HoverBorderGradient } from '@/components/homepage/HoverBorderGradient'
import Heading1 from '@/components/homepage/Heading1'
import AnimElement from '@/components/homepage/AnimElement'
import Link from 'next/link'
import '@/styles/hero.css'
import logoImg from '@/images/logo-3.png'

export default function HeroSection() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div id='hero' className='hero'>
      <div className='relative flex w-full overflow-hidden rounded-md bg-black/[0.96] pb-[5rem] pt-[5rem] antialiased bg-dot-white/[0.2] md:items-center md:justify-center'>
        <Spotlight className='left-0 top-40 md:-top-20 md:left-60' fill='white' />
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'></div>
        <div className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center p-4 pt-20 md:pt-0'>
          <Image src={logoImg} width={200} alt='Namviek icon' className='mb-8' />
          <Heading1 delay={1} duration={6} className='text-center'>
            <span className={`font-semibold tracking-tighter`}>{'Optimized financial solutions'}</span>
            <br />
            <span className={`font-semibold tracking-tighter`}>for lasting success</span>
          </Heading1>
          <AnimElement>
            <p
              className={`text-para1 mx-auto mt-4 max-w-lg text-center text-sm font-normal tracking-tighter text-gray-400 lg:text-lg`}
            >
              The open-source financial management software that helps you manage your finances with ease.
              <p>Author: Le Minh Tuan</p>
            </p>

            <div className='mt-8 flex justify-center'>
              <HoverBorderGradient
                containerClassName='rounded-xl'
                as='button'
                className='flex items-center space-x-2 bg-black text-white'
              >
                <Link className='no-underline' href='/sign-in'>
                  <span>Get Started</span>
                </Link>
              </HoverBorderGradient>
            </div>
          </AnimElement>
        </div>
      </div>
      <AnimElement className=''>
        <div className='hero-slider-container'>
          <Image className='mx-auto w-[1216px]' src={ListViewImage} alt='List view image' />
        </div>
      </AnimElement>
    </div>
  )
}
