import type { Key, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
} from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { useDataTableData } from './hooks/useDataTableData'
import { useDataTableFilters } from './hooks/useDataTableFilters'
import { useDataTablePagination } from './hooks/useDataTablePagination'
import type { DataTableColumn, DataTableProps } from './types'
import './data-table.css'

type ColumnKey = string | number

type ColumnSettingValue = ColumnKey

const normalizeColumnKey = (key: Key): ColumnKey => {
  if (typeof key === 'bigint') return key.toString()
  return key
}

const getColumnKey = <T,>(
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

const resolveColumnLabel = <T,>(
  column: DataTableColumn<T>,
  index: number,
) => {
  const { title } = column
  if (typeof title === 'string' || typeof title === 'number') return title
  if (title && typeof title !== 'function') return title
  const key = getColumnKey(column, index)
  return typeof key === 'string' || typeof key === 'number'
    ? key
    : `Column ${index + 1}`
}

const getRangePlaceholder = (
  placeholder?: string | [string, string],
): [string, string] | undefined => {
  if (!placeholder) return undefined
  return Array.isArray(placeholder) ? placeholder : [placeholder, placeholder]
}

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  dataSource,
  request,
  rowKey,
  loading,
  pagination,
  toolbar,
  columnSetting,
  filters,
  tableProps,
}: DataTableProps<T>) => {
  const [columnSettingOpen, setColumnSettingOpen] = useState(false)

  const { dataSource: resolvedDataSource, loading: resolvedLoading, total } =
    useDataTableData({
      dataSource,
      request,
      loading,
    })

  const {
    form,
    filterItems,
    filteredDataSource,
    handleValuesChange,
  } = useDataTableFilters(resolvedDataSource, filters)

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

  const handleColumnChange = (checked: ColumnSettingValue[]) => {
    const next = new Set<ColumnKey>(checked)
    columnMeta.forEach((item) => {
      if (item.alwaysVisible || item.hideInColumnSetting) {
        next.add(item.key)
      }
    })
    setVisibleColumnKeys(Array.from(next))
  }

  const showToolbar = Boolean(
    toolbar?.add || toolbar?.export || columnSettingEnabled,
  )

  const tablePagination = useDataTablePagination(pagination, total)

  return (
    <div className="data-table">
      {showToolbar && (
        <div className="data-table__toolbar">
          <div className="data-table__toolbar-left">
            {toolbar?.add && (
              <Button
                type="primary"
                onClick={toolbar.add.onClick}
                disabled={toolbar.add.disabled}
              >
                {toolbar.add.label ?? 'Add'}
              </Button>
            )}
            {toolbar?.export && (
              <Button
                onClick={toolbar.export.onClick}
                disabled={toolbar.export.disabled}
              >
                {toolbar.export.label ?? 'Export'}
              </Button>
            )}
          </div>
          <div className="data-table__toolbar-right">
            {columnSettingEnabled && (
              <Button
                icon={<SettingOutlined />}
                onClick={() => setColumnSettingOpen(true)}
              >
                {columnSetting?.label ?? 'Columns'}
              </Button>
            )}
          </div>
        </div>
      )}

      {filterItems.length > 0 && (
        <Form
          form={form}
          className="data-table__filters"
          layout="inline"
          initialValues={filters?.initialValues}
          onValuesChange={handleValuesChange}
        >
          <Space wrap size={[12, 12]}>
            {filterItems.map((item) => {
              const allowClear = item.allowClear ?? true
              const sharedStyle = item.width ? { width: item.width } : undefined

              let control: ReactNode = null
              if (item.type === 'text') {
                control = (
                  <Input
                    placeholder={
                      typeof item.placeholder === 'string'
                        ? item.placeholder
                        : undefined
                    }
                    allowClear={allowClear}
                    style={sharedStyle}
                  />
                )
              }

              if (item.type === 'select') {
                control = (
                  <Select
                    placeholder={
                      typeof item.placeholder === 'string'
                        ? item.placeholder
                        : undefined
                    }
                    allowClear={allowClear}
                    options={item.options}
                    style={sharedStyle ?? { minWidth: 160 }}
                  />
                )
              }

              if (item.type === 'dateRange') {
                control = (
                  <DatePicker.RangePicker
                    allowClear={allowClear}
                    placeholder={getRangePlaceholder(item.placeholder)}
                    style={sharedStyle ?? { minWidth: 240 }}
                  />
                )
              }

              return (
                <Form.Item key={item.key} name={item.key} label={item.label}>
                  {control}
                </Form.Item>
              )
            })}
          </Space>
        </Form>
      )}

      <Table
        rowKey={rowKey}
        columns={displayColumns}
        dataSource={filteredDataSource}
        loading={resolvedLoading}
        pagination={tablePagination}
        {...tableProps}
      />

      <Modal
        title={columnSetting?.modalTitle ?? 'Column Settings'}
        open={columnSettingOpen}
        onOk={() => setColumnSettingOpen(false)}
        onCancel={() => setColumnSettingOpen(false)}
      >
        <Checkbox.Group
          className="data-table__column-setting-list"
          value={columnOptions
            .filter((item) =>
              item.alwaysVisible || visibleColumnKeySet.has(item.key),
            )
            .map((item) => item.key)}
          options={columnOptions.map((item, index) => ({
            label: resolveColumnLabel(item.column, index),
            value: item.key,
            disabled: item.alwaysVisible,
          }))}
          onChange={handleColumnChange}
        />
      </Modal>
    </div>
  )
}
