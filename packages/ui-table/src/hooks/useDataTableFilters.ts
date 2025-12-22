import { Form } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DataTableFilters, FilterValue } from '../types'

type RecordKey<T> = Extract<keyof T, string>

type FilterState = Record<string, FilterValue>

const isEmptyFilterValue = (value: FilterValue) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (typeof value === 'number') return false
  if (Array.isArray(value)) {
    return value.length === 0 || value.every((item) => item == null)
  }
  return true
}

export const useDataTableFilters = <T extends Record<string, unknown>>(
  dataSource: T[],
  filters?: DataTableFilters<T>,
) => {
  const [form] = Form.useForm()
  const [filterValues, setFilterValues] = useState<FilterState>(
    filters?.initialValues ?? {},
  )

  const filterItems = filters?.items ?? []
  const filterMode = filters?.mode ?? 'client'

  useEffect(() => {
    if (filters?.initialValues) {
      setFilterValues(filters.initialValues)
      form.setFieldsValue(filters.initialValues)
    }
  }, [filters?.initialValues, form])

  const handleValuesChange = useCallback(
    (_: unknown, values: Record<string, unknown>) => {
      const nextValues = values as FilterState
      setFilterValues(nextValues)
      filters?.onChange?.(nextValues)
    },
    [filters],
  )

  const filteredDataSource = useMemo(() => {
    if (!filterItems.length || filterMode === 'server') return dataSource

    return dataSource.filter((record) => {
      return filterItems.every((item) => {
        const value = filterValues[item.key]
        if (isEmptyFilterValue(value)) return true

        if (item.filterFn) {
          return item.filterFn(record, value)
        }

        const fieldKey = item.field ?? (item.key as RecordKey<T>)
        const recordValue = fieldKey
          ? (record[fieldKey] as unknown)
          : undefined

        switch (item.type) {
          case 'text': {
            if (recordValue == null) return false
            return String(recordValue)
              .toLowerCase()
              .includes(String(value ?? '').toLowerCase())
          }
          case 'select': {
            return recordValue === value
          }
          case 'dateRange': {
            if (!Array.isArray(value)) return true
            const [start, end] = value
            const parsedDate = dayjs(recordValue as dayjs.ConfigType)
            if (!parsedDate.isValid()) return false
            if (start && parsedDate.isBefore(start, 'day')) return false
            if (end && parsedDate.isAfter(end, 'day')) return false
            return true
          }
          default:
            return true
        }
      })
    })
  }, [dataSource, filterItems, filterMode, filterValues])

  return {
    form,
    filterItems,
    filterValues,
    filteredDataSource,
    handleValuesChange,
  }
}
