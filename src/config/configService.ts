import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
  NEXT_PUBLIC_GA_ID: z.string()
})

const configEnv = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GGID,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || ''
})
if (!configEnv.success) {
  console.error(configEnv.error.errors)
  throw new Error('Invalid configuration')
}

export type Locale = (typeof locales)[number]

export const locales = ['en', 'vi'] as const

export const defaultLocale: Locale = 'vi'

const configProject = configEnv.data

export default configProject
