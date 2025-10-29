"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { CircuitData, DashboardResponse, getDashboardData, getDashboardStats, ApiClientError } from "@/lib/api-client"
import { config } from "@/lib/config"

// Data fetching states
export type DataState = 'idle' | 'loading' | 'success' | 'error'

// Dashboard stats interface
export interface DashboardStats {
  totalCircuits: number
  activeCircuits: number
  circuitsByStatus: Record<string, number>
  circuitsByServiceType: Record<string, number>
  circuitsByPartner: Record<string, number>
}

// Hook return type
export interface UseDashboardDataReturn {
  // Data
  circuits: CircuitData[]
  stats: DashboardStats | null

  // States
  dataState: DataState
  statsState: DataState

  // Error handling
  error: string | null
  statsError: string | null

  // Actions
  refetch: () => Promise<void>
  refetchStats: () => Promise<void>
  isLoading: boolean
  isRefreshing: boolean

  // Pagination
  currentPage: number
  pageSize: number
  totalRecords: number
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void

  // Filters
  filters: {
    status?: string
    servicetype?: string
    partner?: string
  }
  setFilters: (filters: Partial<typeof filters>) => void
  clearFilters: () => void
}

export function useDashboardData(): UseDashboardDataReturn {
  // State for circuit data
  const [circuits, setCircuits] = useState<CircuitData[]>([])
  const [dataState, setDataState] = useState<DataState>('idle')
  const [error, setError] = useState<string | null>(null)

  // State for dashboard stats
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsState, setStatsState] = useState<DataState>('idle')
  const [statsError, setStatsError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalRecords, setTotalRecords] = useState(0)

  // Filter state
  const [filters, setFiltersState] = useState({
    status: undefined as string | undefined,
    servicetype: undefined as string | undefined,
    partner: undefined as string | undefined,
  })

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate derived loading state
  const isLoading = dataState === 'loading' || statsState === 'loading'

  // Handle API errors
  const handleApiError = useCallback((error: unknown): string => {
    if (error instanceof ApiClientError) {
      switch (error.type) {
        case 'network':
          return 'Network connection failed. Please check your internet connection.'
        case 'auth':
          return 'Authentication failed. Please log in again.'
        case 'server':
          return 'Server error. Please try again later.'
        case 'client':
          return error.message || 'Invalid request.'
        default:
          return error.message || 'An unexpected error occurred.'
      }
    }
    return error instanceof Error ? error.message : 'An unexpected error occurred.'
  }, [])

  // Fetch circuit data
  const fetchCircuits = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setDataState('loading')
      }
      setError(null)

      const offset = (currentPage - 1) * pageSize
      const response = await getDashboardData({
        limit: pageSize,
        offset,
        ...filters,
      })

      if (response.success && response.data) {
        setCircuits(response.data)
        setTotalRecords(response.totalRecords || response.data.length)
        setDataState('success')

        if (config.enableDebugLogging) {
          console.log(`📊 Loaded ${response.data.length} circuits (Page ${currentPage})`)
        }
      } else {
        throw new Error(response.message || 'Failed to fetch circuit data')
      }
    } catch (error) {
      const errorMessage = handleApiError(error)
      setError(errorMessage)
      setDataState('error')

      if (config.enableDebugLogging) {
        console.error('❌ Failed to fetch circuits:', error)
      }

      toast.error('Failed to load circuit data', {
        description: errorMessage,
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [currentPage, pageSize, filters, handleApiError])

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsState('loading')
      setStatsError(null)

      const statsData = await getDashboardStats()
      setStats(statsData)
      setStatsState('success')

      if (config.enableDebugLogging) {
        console.log('📈 Dashboard stats loaded:', statsData)
      }
    } catch (error) {
      const errorMessage = handleApiError(error)
      setStatsError(errorMessage)
      setStatsState('error')

      if (config.enableDebugLogging) {
        console.error('❌ Failed to fetch stats:', error)
      }

      toast.error('Failed to load dashboard statistics', {
        description: errorMessage,
      })
    }
  }, [handleApiError])

  // Refetch functions
  const refetch = useCallback(async () => {
    await fetchCircuits(true)
  }, [fetchCircuits])

  const refetchStats = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  // Filter management
  const setFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const clearFilters = useCallback(() => {
    setFiltersState({
      status: undefined,
      servicetype: undefined,
      partner: undefined,
    })
    setCurrentPage(1)
  }, [])

  // Initial data fetch
  useEffect(() => {
    if (dataState === 'idle') {
      fetchCircuits()
    }
  }, [dataState, fetchCircuits])

  useEffect(() => {
    if (statsState === 'idle') {
      fetchStats()
    }
  }, [statsState, fetchStats])

  // Refetch when dependencies change
  useEffect(() => {
    if (dataState !== 'idle') {
      fetchCircuits()
    }
  }, [currentPage, pageSize, filters, fetchCircuits])

  // Log configuration summary on mount
  useEffect(() => {
    if (config.enableDebugLogging) {
      console.log('🚀 EIS Dashboard initialized')
      console.log(`   • API URL: ${config.apiBaseUrl}`)
      console.log(`   • Debug Mode: ${config.enableDebugLogging}`)
      console.log(`   • Mock Data: ${config.enableMockData}`)
    }
  }, [])

  return {
    // Data
    circuits,
    stats,

    // States
    dataState,
    statsState,
    error,
    statsError,

    // Actions
    refetch,
    refetchStats,
    isLoading,
    isRefreshing,

    // Pagination
    currentPage,
    pageSize,
    totalRecords,
    setCurrentPage,
    setPageSize,

    // Filters
    filters,
    setFilters,
    clearFilters,
  }
}