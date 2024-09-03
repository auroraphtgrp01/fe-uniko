import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type Notification = {
  id: number
  title: string
  description: string
  timestamp: Date
  read: boolean
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New message from John Doe',
      description: "Hey, how's it going?",
      timestamp: new Date(Date.now() - 300000),
      read: false
    },
    {
      id: 2,
      title: 'You have a new follower',
      description: 'Jane Smith started following you',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 3,
      title: 'Your post was liked',
      description: 'Your recent post received 50 likes',
      timestamp: new Date(Date.now() - 86400000),
      read: true
    }
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative rounded-full'>
          <Bell className='h-4 w-4' />
          {unreadCount > 0 && (
            <span className='absolute right-0 top-0 me-[5px] mt-[5px] h-2 w-2 rounded-full bg-red-500' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-60 md:w-80'>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className='flex cursor-pointer items-start space-x-3 p-3'
            onClick={() => markAsRead(notification.id)}
          >
            <div className={`mt-1.5 h-2 w-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
            <div className='flex-1 space-y-1'>
              <p className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : ''}`}>
                {notification.title}
              </p>
              <p className='text-xs text-muted-foreground'>{notification.description}</p>
              <p className='text-xs text-muted-foreground'>{formatTimestamp(notification.timestamp)}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer text-center font-medium'>View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
