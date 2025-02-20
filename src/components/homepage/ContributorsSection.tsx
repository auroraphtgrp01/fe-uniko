'use client'

import { motion } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'
import { Github, Linkedin } from 'lucide-react'

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
    <section className='relative py-24 overflow-hidden'>
      <div className='container mx-auto px-4'>
        {/* Decorative elements */}
        <div className='absolute inset-0 -z-10'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-300/30 to-rose-300/30 rounded-full blur-3xl' />
          <div className='absolute bottom-0 left-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl' />
        </div>

        <div className='relative'>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='block text-center text-sm font-medium tracking-wider  uppercase mb-3'
          >
            Our Contributors
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='relative mb-20 text-center'
          >
            <span className='text-4xl font-bold md:text-5xl lg:text-6xl'>
              Meet Our{' '}
              <span className='inline-block  font-bold relative'>
                Amazing Team
                <span className='absolute bottom-0 left-0 w-full h-[2px] bg-white/20'></span>
              </span>
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='absolute left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-rose-600 to-rose-500 mt-6'
            />
          </motion.h2>
        </div>

        <div className='mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4'>
          {contributors.map((contributor, index) => (
            <motion.div
              key={contributor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='relative h-96 w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-all duration-500 ease-in-out dark:bg-black-100 group hover:blur-0 hover:scale-105 peer'
            >
              <Image
                src={contributor.image}
                alt={contributor.name}
                className='absolute inset-0 object-cover transition-all duration-500'
                fill
                priority={index === 0}
              />

              <div className='absolute inset-0 flex flex-col justify-end bg-black/30 px-4 py-8 transition-all duration-500 opacity-0 group-hover:opacity-100'>
                <div className='bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-xl font-medium text-transparent md:text-2xl'>
                  {contributor.name}
                  <p className='text-sm'>{contributor.role}</p>
                </div>

                <a
                  href={contributor.srcGit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='mt-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors'
                >
                  <Github className="w-5 h-5" />
                  <span className='text-sm'>View Github Profile</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
