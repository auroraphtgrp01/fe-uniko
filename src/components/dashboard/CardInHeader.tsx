import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/libraries/utils'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
export default function CardInHeader({ className, contents }: { className?: string; contents?: { detail: string } }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        {contents && (
          <CardDescription>
            <div className='flex items-center justify-between'>
              <div>{contents.detail}</div>
              <Button>
                <Plus />
              </Button>
            </div>
          </CardDescription>
        )}
      </CardContent>
    </Card>
  )
}
