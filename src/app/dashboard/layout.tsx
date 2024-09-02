import Header from '@/components/core/header'
import Sidebar from '@/components/core/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='w-full flex-1 overflow-hidden'>
        <header className='sticky top-0 z-30 h-14 border-b bg-background_nav'>
          <Header />
        </header>
        <div className='p-6'>{children}</div>
      </main>
    </div>
  )
}
