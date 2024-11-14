export const expenditureFundRoutes = {
  getAdvanced: 'expenditure-funds',
  getAll: 'expenditure-funds/all',
  getStatistic: 'expenditure-funds/statistic',
  getStatisticDetailOfFund: 'expenditure-funds/statistic-detail-of-fund/:fundId/:dateRange',
  createExpenditureFund: 'expenditure-funds',
  getOneExpenditureFundById: 'expenditure-funds',
  updateExpenditureFund: 'expenditure-funds/:id',
  joinExpenditureFund: 'participants/join-to-fund/:token',
  deleteExpenditureFund: 'expenditure-funds/remove-one/:id',
  deleteMultipleExpenditureFund: 'expenditure-funds/remove-multiple/:ids'
}
