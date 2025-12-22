import { Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import type { ColumnSettingConfig, ToolbarAction } from '../types'

export interface DataTableToolbarProps {
  toolbar?: {
    add?: ToolbarAction
    export?: ToolbarAction
  }
  columnSetting?: ColumnSettingConfig
  columnSettingEnabled: boolean
  onOpenColumnSetting: () => void
}

export const DataTableToolbar = ({
  toolbar,
  columnSetting,
  columnSettingEnabled,
  onOpenColumnSetting,
}: DataTableToolbarProps) => {
  const showToolbar = Boolean(
    toolbar?.add || toolbar?.export || columnSettingEnabled,
  )

  if (!showToolbar) return null

  return (
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
          <Button onClick={toolbar.export.onClick} disabled={toolbar.export.disabled}>
            {toolbar.export.label ?? 'Export'}
          </Button>
        )}
      </div>
      <div className="data-table__toolbar-right">
        {columnSettingEnabled && (
          <Button icon={<SettingOutlined />} onClick={onOpenColumnSetting}>
            {columnSetting?.label ?? 'Columns'}
          </Button>
        )}
      </div>
    </div>
  )
}
