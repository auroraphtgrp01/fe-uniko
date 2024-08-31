import Header from '@/components/core/header'
import Sidebar from '@/components/core/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='w-full flex-1 overflow-hidden'>
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background'>
          <div className='relative mb-3 ml-auto flex flex-1 md:grow-0'>
            <div className='flex'>
              <Header />
            </div>
          </div>
        </header>
        <div className='p-2'>{children}</div>
      </main>
    </div>
  )
}
