import { IDataTableConfig } from '@/types/common.i'

export const initTableConfig: IDataTableConfig = {
  totalPage: 1,
  currentPage: 1,
  limit: 15,
  types: [],
  selectedTypes: [],
  isPaginate: true,
  isVisibleSortType: true,
  classNameOfScroll: 'h-[calc(100vh-29rem)]'
}
