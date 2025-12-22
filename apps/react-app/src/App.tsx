import { useMemo } from 'react'
import { Card, message, Tag } from 'antd'
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterItem,
} from 'ui-table'
import './App.css'

type UserRecord = {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'Active' | 'Invited' | 'Suspended'
  createdAt: string
}

const dataSource: UserRecord[] = [
  {
    id: 'U-1001',
    name: 'Ava King',
    email: 'ava.king@northwind.dev',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-11-05',
  },
  {
    id: 'U-1002',
    name: 'Liam Harris',
    email: 'liam.harris@northwind.dev',
    role: 'Editor',
    status: 'Invited',
    createdAt: '2024-11-12',
  },
  {
    id: 'U-1003',
    name: 'Mila Watson',
    email: 'mila.watson@northwind.dev',
    role: 'Viewer',
    status: 'Active',
    createdAt: '2024-11-14',
  },
  {
    id: 'U-1004',
    name: 'Noah Price',
    email: 'noah.price@northwind.dev',
    role: 'Editor',
    status: 'Suspended',
    createdAt: '2024-11-18',
  },
  {
    id: 'U-1005',
    name: 'Sophia Reed',
    email: 'sophia.reed@northwind.dev',
    role: 'Viewer',
    status: 'Active',
    createdAt: '2024-11-22',
  },
  {
    id: 'U-1006',
    name: 'Ethan Brown',
    email: 'ethan.brown@northwind.dev',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-12-02',
  },
  {
    id: 'U-1007',
    name: 'Isabella Clark',
    email: 'isabella.clark@northwind.dev',
    role: 'Editor',
    status: 'Invited',
    createdAt: '2024-12-08',
  },
  {
    id: 'U-1008',
    name: 'Lucas Young',
    email: 'lucas.young@northwind.dev',
    role: 'Viewer',
    status: 'Active',
    createdAt: '2024-12-11',
  },
  {
    id: 'U-1009',
    name: 'Mason Ward',
    email: 'mason.ward@northwind.dev',
    role: 'Viewer',
    status: 'Suspended',
    createdAt: '2024-12-18',
  },
  {
    id: 'U-1010',
    name: 'Chloe Scott',
    email: 'chloe.scott@northwind.dev',
    role: 'Editor',
    status: 'Active',
    createdAt: '2024-12-20',
  },
  {
    id: 'U-1011',
    name: 'Jack Hall',
    email: 'jack.hall@northwind.dev',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-12-27',
  },
  {
    id: 'U-1012',
    name: 'Emma Lewis',
    email: 'emma.lewis@northwind.dev',
    role: 'Viewer',
    status: 'Invited',
    createdAt: '2025-01-04',
  },
]

const statusColorMap: Record<UserRecord['status'], string> = {
  Active: 'green',
  Invited: 'gold',
  Suspended: 'red',
}

function App() {
  const columns = useMemo<DataTableColumn<UserRecord>[]>(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        alwaysVisible: true,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        defaultHidden: true,
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (value: UserRecord['status']) => (
          <Tag color={statusColorMap[value]}>{value}</Tag>
        ),
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
    ],
    [],
  )

  const filters = useMemo<DataTableFilterItem<UserRecord>[]>(
    () => [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        field: 'name',
        placeholder: 'Search name',
        width: 200,
      },
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        field: 'role',
        placeholder: 'All roles',
        options: [
          { label: 'Admin', value: 'Admin' },
          { label: 'Editor', value: 'Editor' },
          { label: 'Viewer', value: 'Viewer' },
        ],
      },
      {
        key: 'createdAt',
        label: 'Created',
        type: 'dateRange',
        field: 'createdAt',
        placeholder: ['Start date', 'End date'],
      },
    ],
    [],
  )

  return (
    <div className="app-shell">
      <div className="app-header">
        <h1>Team Users</h1>
        <p>Reusable DataTable wrapper with filters and column settings.</p>
      </div>

      <Card className="app-card" bordered={false}>
        <DataTable<UserRecord>
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          toolbar={{
            add: {
              label: 'Add user',
              onClick: () => message.info('Add action clicked'),
            },
            export: {
              label: 'Export',
              onClick: () => message.success('Export complete'),
            },
          }}
          columnSetting={{
            label: 'Columns',
            modalTitle: 'Select columns',
          }}
          filters={{
            items: filters,
          }}
          tableProps={{ size: 'middle' }}
        />
      </Card>
    </div>
  )
}

export default App
