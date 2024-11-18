'use client'

import { motion } from 'framer-motion'
import GradientBorderAvatar from './GradientBorderAvatar'
import { StaticImageData } from 'next/image'

interface Contributor {
  name: string
  role: string
  image: StaticImageData
  srcGit: string
}

interface ContributorsSectionProps {
  contributors: Contributor[]
}

export default function ContributorsSection({ contributors }: ContributorsSectionProps) {
  return (
    <section className='flex min-h-screen items-center justify-center'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className='container mx-auto px-4 py-16 md:py-24'
      >
        <h2 className='mb-16 text-center text-2xl font-bold text-gray-700 dark:text-white md:text-3xl'>
          Contributors 🌟
        </h2>

        {/* Lead Contributor Section */}
        <div className='mb-16'>
          <motion.div
            className='mx-auto flex max-w-xs flex-col items-center'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <GradientBorderAvatar
              src={contributors[0].image}
              alt={contributors[0].name}
              srcGit={contributors[0].srcGit}
              size='lg'
            />
            <div className='mt-4 text-center'>
              <h3 className='text-xl font-semibold text-gray-700 dark:text-white md:text-2xl'>
                {contributors[0].name}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>Software Engineer</p>
            </div>
          </motion.div>
        </div>

        {/* Other Contributors Section */}
        <div className='mx-auto max-w-6xl'>
          <h4 className='mb-8 text-center text-lg font-semibold text-gray-700 dark:text-white md:text-xl'>
            Brilliant Contributors 🚀
          </h4>
          <div className='grid grid-cols-2 justify-items-center gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4'>
            {contributors.slice(1).map((contributor, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className='flex w-full max-w-[200px] flex-col items-center'
              >
                <GradientBorderAvatar
                  src={contributor.image}
                  alt={contributor.name}
                  srcGit={contributor.srcGit}
                  size='md'
                />
                <div className='mt-3 text-center'>
                  <p className='text-sm font-semibold text-gray-700 dark:text-white md:text-base'>{contributor.name}</p>
                  <p className='text-xs text-gray-600 dark:text-gray-400 md:text-sm'>{contributor.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
