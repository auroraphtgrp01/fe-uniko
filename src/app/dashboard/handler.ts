import { IPayloadDataChart } from '@/components/core/charts/DonutChart'
import { ChartConfig } from '@/components/ui/chart'
import {
  ICashFlowAnalysisStatistic,
  IStatisticOverview,
  ITotalAmount,
  ITotalBalanceChart
} from '@/core/overview/models/overview.interface'
import { initEmptyBalanceChartConfig } from './constants'
import { IAccountBalanceStatistic } from '@/core/account-source/models'

export const initDataStatisticAccountBalance = ({
  data,
  setBalanceChartData,
  setBalanceChartConfig
}: {
  data: IAccountBalanceStatistic[]
  setBalanceChartData: React.Dispatch<React.SetStateAction<ITotalBalanceChart[]>>
  setBalanceChartConfig: React.Dispatch<React.SetStateAction<ChartConfig>>
}) => {
  const { totalBalanceChartData, balanceChartConfig } = data.reduce(
    (result, item, index) => {
      const fill = `hsl(var(--chart-${index + 1}))`
      result.totalBalanceChartData.push({
        account: item.name,
        amount: item.currentAmount,
        fill
      })
      result.balanceChartConfig[item.name] = {
        label: item.name,
        color: fill
      }
      return result
    },
    {
      totalBalanceChartData: [] as ITotalBalanceChart[],
      balanceChartConfig: initEmptyBalanceChartConfig as ChartConfig
    }
  )
  setBalanceChartConfig(balanceChartConfig)
  setBalanceChartData(totalBalanceChartData)
}

export const initDataStatisticCashFlowAnalysis = ({
  data,
  setCashFlowAnalysisChartData,
  setTotalIncome,
  setTotalExpenses
}: {
  data: IStatisticOverview
  setCashFlowAnalysisChartData: React.Dispatch<React.SetStateAction<ICashFlowAnalysisStatistic[]>>
  setTotalIncome: React.Dispatch<React.SetStateAction<ITotalAmount>>
  setTotalExpenses: React.Dispatch<React.SetStateAction<ITotalAmount>>
}) => {
  setCashFlowAnalysisChartData(data.cashFlowAnalysis)
  setTotalIncome(data.totalIncome)
  setTotalExpenses(data.totalExpenses)
}
