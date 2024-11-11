export const transactionRoutes = {
  getAllPayment: 'payment/all',
  getAdvancedTransaction: 'transactions',
  refetchPayment: 'payment/refetch/:id',
  getUnclassifiedTransactions: 'transactions/unclassified/:fundId',
  getTodayTransactions: 'transactions/today',
  updateTransaction: 'transactions/:id',
  deleteAnTransaction: 'transactions/remove-one/:id',
  deleteMultipleTransaction: 'transactions/remove-multiple/:ids'
}
