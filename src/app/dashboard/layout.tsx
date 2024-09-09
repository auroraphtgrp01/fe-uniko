import Header from '@/components/core/header'
import Sidebar from '@/components/core/sidebar'
import BreadcrumbHeader from '../../components/core/breadcrumb'
import { Footer } from '../../components/core/footer'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='w-full flex-1 overflow-hidden pb-16'>
        {' '}
        <header className='sticky top-0 z-30 h-14 border-b-[1px] bg-background_nav'>
          <Header />
        </header>
        <div className='px-6 pt-4'>
          <div>
            <h1 className='mb-4 text-2xl font-semibold text-foreground'>
              <BreadcrumbHeader />
            </h1>
          </div>
          <div>{children}</div>
        </div>
        <Footer />
      </main>
    </div>
  )
}
