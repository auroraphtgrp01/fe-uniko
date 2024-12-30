export interface ICashFlowAnalysisStatistic {
  outgoing: number
  incoming: number
  date: string
}

export interface ITotalAmount {
  amount: number
  rate: string
}

export interface IStatisticOverview {
  totalIncome: ITotalAmount
  totalExpenses: ITotalAmount
  cashFlowAnalysis: ICashFlowAnalysisStatistic[]
}

export interface ITotalBalanceChart {
  account: string
  amount: number
  fill: string
}
