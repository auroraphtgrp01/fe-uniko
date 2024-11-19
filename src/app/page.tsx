import MainSection from '@/components/homepage/MainSection'
import { homeMetadata } from './metadata'
import { Metadata } from 'next'

export const metadata: Metadata = homeMetadata

export default function Home() {
  return (
    <main className='relative min-h-screen w-full overflow-hidden'>
      <MainSection />
    </main>
  )
}
