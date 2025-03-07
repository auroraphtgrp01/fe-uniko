export const accountSourceRoutes = {
  getById: 'account-sources/get-by-id/:id',
  getAdvanced: 'account-sources/advanced/:fundId',
  getAll: 'account-sources/all/:fundId',
  getStatisticAccountBalance: 'account-sources/statistic-account-balance/:fundId',
  createAccountSource: 'account-sources',
  getOneAccountSourceById: 'account-sources',
  updateAccountSource: 'account-sources/:id',
  deleteAccountSource: 'account-sources/remove-one/:id',
  deleteMultipleAccountSource: 'account-sources/remove-multiple/:ids'
}
