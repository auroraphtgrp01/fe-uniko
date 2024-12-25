import { IPayloadDataChart } from '@/components/core/charts/DonutChart'
import { ChartConfig } from '@/components/ui/chart'
import {
  ICashFlowAnalysisStatistic,
  IStatisticOverview,
  ITotalAmount,
  ITotalBalanceChart
} from '@/core/overview/models/overview.interface'
import { initEmptyBalanceChartConfig } from './constants'

export const initData = ({
  data,
  setCashFlowAnalysisChartData,
  setBalanceChartData,
  setTotalIncome,
  setTotalExpenses,
  setBalanceChartConfig
}: {
  data: IStatisticOverview
  setCashFlowAnalysisChartData: React.Dispatch<React.SetStateAction<ICashFlowAnalysisStatistic[]>>
  setBalanceChartData: React.Dispatch<React.SetStateAction<ITotalBalanceChart[]>>
  setTotalIncome: React.Dispatch<React.SetStateAction<ITotalAmount>>
  setTotalExpenses: React.Dispatch<React.SetStateAction<ITotalAmount>>
  setBalanceChartConfig: React.Dispatch<React.SetStateAction<ChartConfig>>
}) => {
  setCashFlowAnalysisChartData(data.cashFlowAnalysis)
  setTotalIncome(data.totalIncome)
  setTotalExpenses(data.totalExpenses)
  const { totalBalanceChartData, balanceChartConfig } = data.accountSources.reduce(
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
