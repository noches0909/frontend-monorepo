import type { ColumnType, TablePaginationConfig, TableProps } from 'antd/es/table'
import type { Dayjs } from 'dayjs'

export type DataTableColumn<T> = ColumnType<T> & {
  hideInColumnSetting?: boolean
  defaultHidden?: boolean
  alwaysVisible?: boolean
}

type RecordKey<T> = Extract<keyof T, string>

export type FilterType = 'text' | 'select' | 'dateRange'

export type FilterValue =
  | string
  | number
  | [Dayjs | null, Dayjs | null]
  | null
  | undefined

export interface DataTableFilterItem<T> {
  key: string
  label: string
  type: FilterType
  field?: RecordKey<T>
  placeholder?: string | [string, string]
  options?: Array<{ label: string; value: string | number }>
  allowClear?: boolean
  width?: number
  filterFn?: (record: T, value: FilterValue) => boolean
}

export interface DataTableFilters<T> {
  items: DataTableFilterItem<T>[]
  initialValues?: Record<string, FilterValue>
  onChange?: (values: Record<string, FilterValue>) => void
  mode?: 'client' | 'server'
}

export interface ToolbarAction {
  label?: string
  onClick?: () => void
  disabled?: boolean
}

export interface ColumnSettingConfig {
  enabled?: boolean
  label?: string
  modalTitle?: string
}

export type DataTableRequestResult<T> = T[] | { data: T[]; total?: number }

export type DataTableRequest<T> = () => Promise<DataTableRequestResult<T>>

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  dataSource?: T[]
  request?: DataTableRequest<T>
  rowKey: TableProps<T>['rowKey']
  loading?: boolean
  pagination?: TablePaginationConfig | false
  toolbar?: {
    add?: ToolbarAction
    export?: ToolbarAction
  }
  columnSetting?: ColumnSettingConfig
  filters?: DataTableFilters<T>
  tableProps?: Omit<
    TableProps<T>,
    'columns' | 'dataSource' | 'rowKey' | 'pagination'
  >
}
