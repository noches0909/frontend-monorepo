import { useState } from 'react'
import { Table } from 'antd'
import { DataTableColumnSetting } from './components/DataTableColumnSetting'
import { DataTableFilters } from './components/DataTableFilters'
import { DataTableToolbar } from './components/DataTableToolbar'
import { useDataTableColumns } from './hooks/useDataTableColumns'
import { useDataTableData } from './hooks/useDataTableData'
import { useDataTableFilters } from './hooks/useDataTableFilters'
import { useDataTablePagination } from './hooks/useDataTablePagination'
import type { DataTableProps } from './types'
import './data-table.css'

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

  const {
    columnSettingEnabled,
    displayColumns,
    columnSettingOptions,
    selectedColumnKeys,
    handleColumnChange,
  } = useDataTableColumns(columns, columnSetting)

  const tablePagination = useDataTablePagination(pagination, total)

  return (
    <div className="data-table">
      <DataTableToolbar
        toolbar={toolbar}
        columnSetting={columnSetting}
        columnSettingEnabled={columnSettingEnabled}
        onOpenColumnSetting={() => setColumnSettingOpen(true)}
      />

      <DataTableFilters
        form={form}
        items={filterItems}
        initialValues={filters?.initialValues}
        onValuesChange={handleValuesChange}
      />

      <Table
        rowKey={rowKey}
        columns={displayColumns}
        dataSource={filteredDataSource}
        loading={resolvedLoading}
        pagination={tablePagination}
        {...tableProps}
      />

      {columnSettingEnabled && (
        <DataTableColumnSetting
          open={columnSettingOpen}
          columnSetting={columnSetting}
          options={columnSettingOptions}
          value={selectedColumnKeys}
          onChange={handleColumnChange}
          onClose={() => setColumnSettingOpen(false)}
        />
      )}
    </div>
  )
}
