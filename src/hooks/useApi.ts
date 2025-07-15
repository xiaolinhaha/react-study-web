import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '@/config';

// 通用 API Hook
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  immediate = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.statusCode === 200) {
        setData(response.data || null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

// 分页 API Hook
export function usePaginatedApi<T>(
  apiCall: (params: any) => Promise<ApiResponse<{ list: T[]; pagination: any }>>,
  initialParams = { page: 1, pageSize: 10 }
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(initialParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (params = pagination) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall(params);
      
      if (response.statusCode === 200) {
        setData(response.data?.list || []);
        setPagination({ ...params, total: response.data?.pagination?.total });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
    } finally {
      setLoading(false);
    }
  }, [apiCall, pagination]);

  useEffect(() => {
    fetchData();
  }, []);

  const changePage = useCallback((page: number) => {
    const newParams = { ...pagination, page };
    setPagination(newParams);
    fetchData(newParams);
  }, [pagination, fetchData]);

  const changePageSize = useCallback((pageSize: number) => {
    const newParams = { ...pagination, page: 1, pageSize };
    setPagination(newParams);
    fetchData(newParams);
  }, [pagination, fetchData]);

  const refresh = useCallback(() => {
    fetchData(pagination);
  }, [fetchData, pagination]);

  return {
    data,
    pagination,
    loading,
    error,
    changePage,
    changePageSize,
    refresh
  };
}

// 异步操作 Hook（用于创建、更新、删除等操作）
export function useAsyncOperation<T, P = any>(
  operation: (params: P) => Promise<ApiResponse<T>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await operation(params);
      
      if (response.statusCode === 200) {
        setSuccess(true);
        return response.data || null;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, [operation]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    success,
    execute,
    reset
  };
} 