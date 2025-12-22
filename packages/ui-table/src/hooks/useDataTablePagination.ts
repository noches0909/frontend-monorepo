import { useMemo } from 'react'
import type { TablePaginationConfig } from 'antd/es/table'

export const useDataTablePagination = (
  pagination: TablePaginationConfig | false | undefined,
  total?: number,
): TablePaginationConfig | false => {
  return useMemo(() => {
    if (pagination === undefined || pagination === false) return false
    const nextPagination: TablePaginationConfig = {
      position: ['bottomRight'],
      ...pagination,
    }
    if (typeof total === 'number') {
      nextPagination.total = total
    }
    return nextPagination
  }, [pagination, total])
}
