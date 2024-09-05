import { NavItem } from '@/types/core.i'

export const navItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Overview'
  },
  {
    title: 'Tracker Transaction',
    href: '/dashboard/tracker-transaction',
    icon: 'layers',
    label: 'Tracker Transaction'
  },
  {
    title: 'Transaction',
    href: '/dashboard/transaction',
    icon: 'shoppingCart',
    label: 'Transaction',
    children: [
      {
        title: 'Detail',
        href: '/dashboard/transaction/detail',
        label: 'Detail'
      }
    ]
  },
  {
    title: 'Account Source',
    href: '/dashboard/account-source',
    icon: 'billing',
    label: 'Account Source',
    children: [
      {
        title: 'Account Detail',
        href: '/dashboard/account-source/detail',
        label: 'Account Detail'
      }
    ]
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'user',
    label: 'Profile',
    children: [
      {
        title: '',
        href: '/dashboard/account-source/detail',
        label: 'Account Detail'
      }
    ]
  }
]
