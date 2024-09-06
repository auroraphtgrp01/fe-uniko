import HeroSection from '@/components/homepage/HeroSection'
import NextTopLoader from 'nextjs-toploader'

export default function Home() {
  return (
    <main className='relative bg-black'>
      <NextTopLoader />
      <HeroSection />
    </main>
  )
}
