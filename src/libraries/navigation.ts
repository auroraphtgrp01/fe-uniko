import { locales } from '@/config/configService'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

const sharedNavigation = createSharedPathnamesNavigation({ locales })

export const { Link, redirect, usePathname, useRouter } = sharedNavigation
