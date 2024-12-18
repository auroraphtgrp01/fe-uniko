import Header from '@/components/core/header'
import Sidebar from '@/components/core/sidebar'
import BreadcrumbHeader from '../../components/core/breadcrumb'
import { ChatBox } from '../../components/dashboard/BoxChat'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='w-full flex-1'>
        <header className='sticky top-0 z-30 h-[3.2rem] border-b-[1px] bg-background_nav'>
          <Header />
        </header>
        <div className='h-[calc(100vh-3.2rem)] overflow-y-auto px-6 pt-3'>
          <div>
            <h1 className='mb-3 text-2xl font-semibold text-foreground'>
              <BreadcrumbHeader />
            </h1>
          </div>
          <div className='overflow-x-hidden pb-2'>{children}</div>
          <ChatBox></ChatBox>
        </div>
      </main>
    </div>
  )
}
