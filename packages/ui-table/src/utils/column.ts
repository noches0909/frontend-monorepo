import type { Key, ReactNode } from 'react'
import type { DataTableColumn } from '../types'

export type ColumnKey = string | number

// 兼容 bigint 的 key，避免与 Checkbox 组件类型冲突
const normalizeColumnKey = (key: Key): ColumnKey => {
  if (typeof key === 'bigint') return key.toString()
  return key
}

export const getColumnKey = <T,>(
  column: DataTableColumn<T>,
  index: number,
): ColumnKey => {
  if (column.key !== undefined) return normalizeColumnKey(column.key)
  const { dataIndex } = column
  if (Array.isArray(dataIndex)) return dataIndex.join('.')
  if (typeof dataIndex === 'string' || typeof dataIndex === 'number') {
    return dataIndex
  }
  return index
}

export const resolveColumnLabel = <T,>(
  column: DataTableColumn<T>,
  index: number,
): ReactNode => {
  const { title } = column
  if (typeof title === 'string' || typeof title === 'number') return title
  if (title && typeof title !== 'function') return title
  const key = getColumnKey(column, index)
  return typeof key === 'string' || typeof key === 'number'
    ? key
    : `Column ${index + 1}`
}
