import { useState } from 'react'
import { useDebouncedValue } from './use-debounced-value'

interface UseOptimizedTableFiltersParams {
  /** Debounce delay for search input in milliseconds */
  searchDelay?: number
  /** Initial search value */
  initialSearch?: string
  /** Initial filters */
  initialFilters?: Record<string, any>
}

interface UseOptimizedTableFiltersReturn<TFilters = Record<string, any>> {
  /** Current page number */
  page: number
  /** Items per page */
  perPage: number
  /** Current search input value (not debounced) */
  search: string
  /** Debounced search value for API calls */
  debouncedSearch: string | undefined
  /** Additional filters */
  filters: TFilters
  /** Set page number */
  setPage: (page: number) => void
  /** Set items per page */
  setPerPage: (perPage: number) => void
  /** Handle search change with auto page reset */
  handleSearchChange: (search: string) => void
  /** Handle filter change with auto page reset */
  handleFilterChange: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void
  /** Update multiple filters at once */
  updateFilters: (newFilters: Partial<TFilters>) => void
  /** Reset all filters and search */
  resetFilters: () => void
}

/**
 * Optimized table filters hook with debounced search and automatic page reset
 * 
 * @example
 * ```tsx
 * const tableFilters = useOptimizedTableFilters({
 *   searchDelay: 300,
 *   initialSearch: '',
 *   initialFilters: { status: 'active', category: null }
 * })
 * 
 * // Use in component
 * const { data } = useQuery({
 *   queryKey: ['items', tableFilters.page, tableFilters.perPage, tableFilters.debouncedSearch, tableFilters.filters],
 *   queryFn: () => api.getItems({
 *     page: tableFilters.page,
 *     perPage: tableFilters.perPage,
 *     search: tableFilters.debouncedSearch,
 *     ...tableFilters.filters
 *   })
 * })
 * ```
 */
export function useOptimizedTableFilters<TFilters extends Record<string, any> = Record<string, any>>({
  searchDelay = 300,
  initialSearch = '',
  initialFilters = {} as TFilters,
}: UseOptimizedTableFiltersParams = {}): UseOptimizedTableFiltersReturn<TFilters> {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState(initialSearch)
  const [filters, setFilters] = useState<TFilters>(initialFilters as TFilters)

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebouncedValue(search, searchDelay)

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    setPage(1) // Reset to first page when searching
  }

  const handleFilterChange = <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filtering
  }

  const updateFilters = (newFilters: Partial<TFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(1) // Reset to first page when updating filters
  }

  const resetFilters = () => {
    setSearch(initialSearch)
    setFilters(initialFilters as TFilters)
    setPage(1)
  }

  return {
    page,
    perPage,
    search,
    debouncedSearch: debouncedSearch || undefined,
    filters,
    setPage,
    setPerPage,
    handleSearchChange,
    handleFilterChange,
    updateFilters,
    resetFilters,
  }
}
