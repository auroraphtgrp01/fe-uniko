import { Icons } from '@/components/ui/icons'
import { IDynamicType } from './common.i'

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
  children?: NavItem[]
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren

export interface IButtonInDataTableHeader {
  title: string
  onClick: () => void
  icon?: any
  variants:
    | 'link'
    | 'default'
    | 'blueCol'
    | 'blueVin'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'greenPastel1'
    | null
    | undefined
  disabled?: boolean
}

export type IErrorResponseBase = {
  timestamp: string
  errorName: string
  errorCode: string
  message: string
  details: string[]
}
