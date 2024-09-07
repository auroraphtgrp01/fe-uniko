import Header from '@/components/core/header'
import Sidebar from '@/components/core/sidebar'
import BreadcrumbHeader from '../../components/core/breadcrumb'
import AnimatedComponent from '../../components/common/AnimatedComponent'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='w-full flex-1 overflow-hidden'>
        <header className='sticky top-0 z-30 h-14 border-b-[1px] bg-background_nav'>
          <Header />
        </header>
        <div className='p-6'>
          <div>
            <h1 className='mb-4 text-2xl font-semibold text-foreground'>
              <BreadcrumbHeader />
            </h1>
          </div>
          <div>{children}</div>
        </div>
      </main>
    </div>
  )
}
