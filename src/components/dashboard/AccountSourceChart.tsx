import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateRangePicker } from '../core/DateRangePicker'
import { IDateRange } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { EAccountSourceType } from '@/core/account-source/models'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
interface ITabContent {
    labels: string
    value: string
    content: JSX.Element
}

export interface ITabConfig {
    tabContents: ITabContent[]
    default: string
}

interface IAccountSourceChartProps {
    tabConfig: ITabConfig
    statisticSelectTypeAccount: {
        currentTypeAccount: string
        setCurrentTypeAccount: React.Dispatch<React.SetStateAction<EAccountSourceType>>
    }
}

export default function AccountSourceChart({ tabConfig, statisticSelectTypeAccount }: IAccountSourceChartProps) {
    const [currentTab, setCurrentTab] = useState(tabConfig.default)

    return (
        <Tabs value={currentTab} onValueChange={setCurrentTab} className='h-full flex-1 rounded-md'>
            <Card className='h-full w-full'>
                <CardContent className='items-center justify-center'>
                    <TabsList className='col-span-2 mt-5 grid w-full grid-cols-2'>
                        {tabConfig.tabContents.length > 0
                            ? tabConfig.tabContents.map((tabContent: ITabContent, index: number) => (
                                <React.Fragment key={tabContent.value}>
                                    <TabsTrigger value={tabContent.value} className='flex items-center gap-2'>
                                        {index === 0 && <TrendingDown width={15} height={15} />}
                                        {tabContent.labels} {index === 1 && <TrendingUp width={15} height={15} />}
                                    </TabsTrigger>
                                </React.Fragment>
                            ))
                            : ''}
                    </TabsList>
                    <div className='mt-4'>
                        {currentTab === 'Detail Balance' && (
                            <Select
                                value={statisticSelectTypeAccount.currentTypeAccount}
                                onValueChange={(value: EAccountSourceType) => statisticSelectTypeAccount.setCurrentTypeAccount(value)}
                            >
                                <SelectTrigger className='bg-background px-2 text-center hover:bg-accent/50'>
                                    <SelectValue placeholder='Select type account' />
                                </SelectTrigger>
                                <SelectContent className='w-full'>
                                    <SelectItem value='WALLET'>Wallet</SelectItem>
                                    <SelectItem value='BANKING'>Banking</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {tabConfig.tabContents.length > 0
                        ? tabConfig.tabContents.map((tabContent: ITabContent) => (
                            <React.Fragment key={tabContent.value}>
                                <TabsContent value={tabContent.value} className='mt-5 h-fit py-0 max-sm:-mt-5 max-sm:py-10'>
                                    {tabContent.content}
                                </TabsContent>
                            </React.Fragment>
                        ))
                        : ''}
                </CardContent>
            </Card>
        </Tabs>
    )
}
