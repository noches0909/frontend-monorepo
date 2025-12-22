import { useCallback, useEffect, useRef, useState } from 'react'
import type { DataTableRequest, DataTableRequestResult } from '../types'

type DataTableDataState<T> = {
  dataSource: T[]
  loading: boolean
  total?: number
  refresh: () => Promise<void>
}

const resolveRequestResult = <T,>(result: DataTableRequestResult<T>) => {
  if (Array.isArray(result)) {
    return { data: result, total: undefined }
  }
  return {
    data: result.data,
    total: result.total,
  }
}

export const useDataTableData = <T extends Record<string, unknown>>({
  dataSource,
  request,
  loading,
}: {
  dataSource?: T[]
  request?: DataTableRequest<T>
  loading?: boolean
}): DataTableDataState<T> => {
  const [internalData, setInternalData] = useState<T[]>(dataSource ?? [])
  const [internalLoading, setInternalLoading] = useState(false)
  const [total, setTotal] = useState<number | undefined>()
  const requestIdRef = useRef(0)

  const refresh = useCallback(async () => {
    if (!request) return
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setInternalLoading(true)

    try {
      const result = await request()
      if (requestIdRef.current !== requestId) return
      const { data, total: nextTotal } = resolveRequestResult(result)
      setInternalData(data)
      setTotal(nextTotal)
    } catch (error) {
      if (requestIdRef.current === requestId) {
        setInternalData([])
        setTotal(undefined)
      }
      console.error('[DataTable] request failed', error)
    } finally {
      if (requestIdRef.current === requestId) {
        setInternalLoading(false)
      }
    }
  }, [request])

  useEffect(() => {
    if (!request) {
      setInternalData(dataSource ?? [])
      setTotal(undefined)
    }
  }, [dataSource, request])

  useEffect(() => {
    if (request) {
      void refresh()
    }
  }, [request, refresh])

  return {
    dataSource: internalData,
    loading: loading ?? internalLoading,
    total,
    refresh,
  }
}
