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
  accountSources: IAccountSourceStatisticOverview[]
  cashFlowAnalysis: ICashFlowAnalysisStatistic[]
}

interface IAccountSourceStatisticOverview {
  name: string
  currentAmount: number
}

export interface ITotalBalanceChart {
  account: string
  amount: number
  fill: string
}
