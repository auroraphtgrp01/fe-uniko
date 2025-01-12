export const trackerTransactionRoutes = {
  classify: 'tracker-transactions/classify',
  create: 'tracker-transactions',
  update: 'tracker-transactions/:id',
  statistics: 'tracker-transactions/statistics/:fundId',
  getAdvanced: 'tracker-transactions/query-advanced/:fundId',
  deleteAnTrackerTransaction: 'tracker-transactions/remove-one/:id',
  deleteMultipleTrackerTransaction: 'tracker-transactions/remove-multiple/:ids'
}
