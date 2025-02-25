import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Logo2 from '@/images/logo-2.png'
import { ModeToggle } from '@/libraries/mode-toggle'
import { UserNav } from '@/components/core/user-nav'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { isLogin } from '@/libraries/helpers'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const isLoginUser = isLogin()

  useEffect(() => {
    setWindowWidth(window.innerWidth)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isMobile = windowWidth <= 768

  return (
    <motion.nav
      animate={{
        width: isMenuOpen
          ? '100%'
          : !isMobile
            ? isScrolled
              ? windowWidth <= 1280
                ? '80%'
                : '55%'
              : '91.666667%'
            : '100%',
        marginTop: !isMobile ? (isScrolled ? '1rem' : '0') : '0',
        boxShadow: !isMobile
          ? isScrolled
            ? '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            : 'none'
          : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        backgroundColor: isMenuOpen
          ? 'var(--menu-bg)'
          : !isMobile
            ? isScrolled
              ? 'var(--nav-bg-scrolled)'
              : 'transparent'
            : 'var(--nav-bg-mobile)'
      }}
      transition={{
        duration: 0.7,
        ease: 'easeInOut'
      }}
      className={`fixed left-1/2 max-w-6xl -translate-x-1/2 ${!isMobile ? 'rounded-2xl' : ''} z-50 ${isMenuOpen ? 'h-screen w-full bg-background/80 dark:bg-background/95' : ''} ${isScrolled ? 'backdrop-blur-lg' : ''}`}
      style={
        {
          '--menu-bg': 'var(--background, rgba(255, 255, 255, 0.95))',
          '--nav-bg-scrolled': 'var(--background, rgba(255, 255, 255, 0.8))',
          '--nav-bg-mobile': 'var(--background, rgba(255, 255, 255, 0.9))'
        } as React.CSSProperties
      }
    >
      <div className='flex items-center justify-between p-2'>
        <a href='#'>
          <div className='flex items-center'>
            <Image
              src={Logo2}
              alt='Logo'
              width={30}
              height={30}
              priority
              style={{ objectFit: 'cover' }}
              className='h-full w-full pl-2'
            />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isScrolled ? 0 : 1,
                scale: isScrolled ? 0.8 : 1
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.6,
                ease: 'easeOut'
              }}
              className='ms-1 mt-1 text-[1.2rem] font-semibold text-[#e4355e]'
            >
              UNIKO
            </motion.span>
          </div>
        </a>
        <ul className='hidden space-x-10 md:flex'>
          {['home', 'overview', 'platform', 'contributors'].map((item, index) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut'
              }}
            >
              <a
                href={`#${item}`}
                className='font-semibold text-gray-700 transition-colors hover:text-primary dark:text-gray-200 dark:hover:text-primary'
              >
                {item === 'home' ? 'Trang chủ' :
                  item === 'overview' ? 'Tổng quan' :
                    item === 'platform' ? 'Nền tảng' : 'Đóng góp'}
              </a>
            </motion.li>
          ))}
        </ul>
        <div className='flex items-center space-x-2'>
          <ModeToggle />
          {isLoginUser !== null ? <UserNav /> : <div className='py-5'></div>}
          <button className='z-50 pr-2 md:hidden' onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X size={24} onClick={() => setIsMenuOpen(false)} />
            ) : (
              <Menu size={24} onClick={() => setIsMenuOpen(!isMenuOpen)} />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className='fixed inset-0 left-0 top-0 z-40 h-full w-full bg-background/80 pt-16 backdrop-blur-sm dark:bg-background/95 md:hidden'>
          <ul className='flex flex-col items-center space-y-8 pt-8'>
            <li>
              <a
                href='#home'
                className='text-xl font-semibold text-gray-700 dark:text-foreground'
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href='#platform'
                className='text-xl font-semibold text-gray-700 dark:text-foreground'
                onClick={() => setIsMenuOpen(false)}
              >
                Nền tảng
              </a>
            </li>
            <li>
              <a
                href='#contributors'
                className='text-xl font-semibold text-gray-700 dark:text-foreground'
                onClick={() => setIsMenuOpen(false)}
              >
                Đóng góp
              </a>
            </li>
          </ul>
        </div>
      )}
    </motion.nav>
  )
}
