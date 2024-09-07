'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

export default function AnimatedComponent({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='animated-component'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
