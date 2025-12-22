import { Checkbox, Modal } from 'antd'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { ColumnSettingConfig } from '../types'
import type { ColumnKey } from '../utils/column'

export type ColumnSettingOption = {
  label: ReactNode
  value: ColumnKey
  disabled?: boolean
}

export interface DataTableColumnSettingProps {
  open: boolean
  columnSetting?: ColumnSettingConfig
  options: ColumnSettingOption[]
  value: ColumnKey[]
  onChange: (value: ColumnKey[]) => void
  onClose: () => void
}

export const DataTableColumnSetting = ({
  open,
  columnSetting,
  options,
  value,
  onChange,
  onClose,
}: DataTableColumnSettingProps) => {
  const [draftValue, setDraftValue] = useState<ColumnKey[]>(value)

  useEffect(() => {
    if (open) {
      // 打开弹窗时同步一次初始值
      setDraftValue(value)
    }
  }, [open, value])

  return (
    <Modal
      title={columnSetting?.modalTitle ?? 'Column Settings'}
      open={open}
      onOk={() => {
        onChange(draftValue)
        onClose()
      }}
      onCancel={onClose}
    >
      <Checkbox.Group
        className="data-table__column-setting-list"
        value={draftValue}
        options={options}
        onChange={(checked) => setDraftValue(checked as ColumnKey[])}
      />
    </Modal>
  )
}
