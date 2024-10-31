import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/libraries/utils'
import { useTranslation } from 'react-i18next'

export default function CardInHeader({ className }: { className?: string }) {
  const { t } = useTranslation(['common'])
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t('card_header.create_project')}</CardTitle>
        <CardDescription>{t('card_header.deploy_project')}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  )
}
