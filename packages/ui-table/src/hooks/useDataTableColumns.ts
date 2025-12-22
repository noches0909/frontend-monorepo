import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import type { ColumnSettingConfig, DataTableColumn } from '../types'
import { getColumnKey, resolveColumnLabel, type ColumnKey } from '../utils/column'

export type ColumnSettingOption = {
  label: ReactNode
  value: ColumnKey
  disabled?: boolean
}

export const useDataTableColumns = <T extends Record<string, unknown>>(
  columns: DataTableColumn<T>[],
  columnSetting?: ColumnSettingConfig,
) => {
  const columnMeta = useMemo(() => {
    return columns.map((column, index) => {
      const key = getColumnKey(column, index)
      return {
        key,
        title: resolveColumnLabel(column, index),
        hideInColumnSetting: column.hideInColumnSetting,
        defaultHidden: column.defaultHidden,
        alwaysVisible: column.alwaysVisible,
        column,
      }
    })
  }, [columns])

  const [visibleColumnKeys, setVisibleColumnKeys] = useState<ColumnKey[]>(() => {
    return columnMeta
      .filter(
        (item) =>
          item.alwaysVisible || item.hideInColumnSetting || !item.defaultHidden,
      )
      .map((item) => item.key)
  })

  const columnSettingEnabled = columnSetting?.enabled !== false

  const columnOptions = useMemo(() => {
    return columnMeta.filter((item) => !item.hideInColumnSetting)
  }, [columnMeta])

  const visibleColumnKeySet = useMemo(
    () => new Set(visibleColumnKeys),
    [visibleColumnKeys],
  )

  const displayColumns = useMemo(() => {
    if (!columnSettingEnabled) return columns
    return columnMeta
      .filter(
        (item) =>
          item.hideInColumnSetting ||
          item.alwaysVisible ||
          visibleColumnKeySet.has(item.key),
      )
      .map((item) => item.column)
  }, [columnMeta, columnSettingEnabled, columns, visibleColumnKeySet])

  const selectedColumnKeys = useMemo(() => {
    return columnOptions
      .filter((item) => item.alwaysVisible || visibleColumnKeySet.has(item.key))
      .map((item) => item.key)
  }, [columnOptions, visibleColumnKeySet])

  const columnSettingOptions = useMemo<ColumnSettingOption[]>(() => {
    return columnOptions.map((item) => ({
      label: item.title,
      value: item.key,
      disabled: item.alwaysVisible,
    }))
  }, [columnOptions])

  const handleColumnChange = (checked: ColumnKey[]) => {
    const next = new Set<ColumnKey>(checked)
    // 强制保留始终显示/不允许配置的列
    columnMeta.forEach((item) => {
      if (item.alwaysVisible || item.hideInColumnSetting) {
        next.add(item.key)
      }
    })
    setVisibleColumnKeys(Array.from(next))
  }

  return {
    columnSettingEnabled,
    displayColumns,
    columnSettingOptions,
    selectedColumnKeys,
    handleColumnChange,
  }
}
