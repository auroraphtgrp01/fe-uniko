'use client'

import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link' // Import next/link for client-side navigation
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { navItems } from '@/constants/routes'
import { NavItem } from '@/types/core.i'

// Recursive function to find the corresponding navigation item based on path
function findNavItem(path: string, items = navItems): NavItem | undefined {
  for (const item of items) {
    if (item.href === path) {
      return item
    }
    if (item.children) {
      const found = findNavItem(path, item.children)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

export default function BreadcrumbHeader() {
  const path = usePathname()

  const breadcrumbItems = useMemo(() => {
    const segments = path.split('/').filter((seg) => seg)
    const paths = segments.map((segment, index) => `/${segments.slice(0, index + 1).join('/')}`)

    return paths.map((path, index) => {
      const navItem = findNavItem(path)
      return {
        title: navItem?.title || 'Dashboard',
        href: path,
        isLast: index === paths.length - 1
      }
    })
  }, [path])

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {breadcrumbItems.map((item) => (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
