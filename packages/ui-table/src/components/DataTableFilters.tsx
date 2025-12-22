import type { ReactNode } from 'react'
import { DatePicker, Form, Input, Select, Space } from 'antd'
import type { FormInstance } from 'antd'
import type { DataTableFilterItem, FilterValue } from '../types'

type DataTableFiltersProps<T> = {
  form: FormInstance
  items: DataTableFilterItem<T>[]
  initialValues?: Record<string, FilterValue>
  onValuesChange: (changed: unknown, values: Record<string, unknown>) => void
}

const getRangePlaceholder = (
  placeholder?: string | [string, string],
): [string, string] | undefined => {
  if (!placeholder) return undefined
  // RangePicker 需要固定长度的 placeholder
  return Array.isArray(placeholder) ? placeholder : [placeholder, placeholder]
}

export const DataTableFilters = <T extends Record<string, unknown>>({
  form,
  items,
  initialValues,
  onValuesChange,
}: DataTableFiltersProps<T>) => {
  if (items.length === 0) return null

  return (
    <Form
      form={form}
      className="data-table__filters"
      layout="inline"
      initialValues={initialValues}
      onValuesChange={onValuesChange}
    >
      <Space wrap size={[12, 12]}>
        {items.map((item) => {
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
  )
}
