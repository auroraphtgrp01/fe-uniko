'use client'

import { useStoreLocal } from '@/hooks/useStoreLocal'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  const { setCheckHeightRange, checkHeightRange } = useStoreLocal()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    const updateScreenHeight = () => {
      const viewportHeight = window.innerHeight
      if (viewportHeight >= 600 && viewportHeight <= 771) {
        setCheckHeightRange(true)
      } else {
        setCheckHeightRange(false)
      }
      console.log("🚀 ~ updateScreenHeight ~ viewportHeight:", viewportHeight)
    }

    updateScreenHeight()
    window.addEventListener('resize', updateScreenHeight)

    return () => {
      window.removeEventListener('resize', updateScreenHeight)
    };
  }, [checkHeightRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}
