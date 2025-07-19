# Optimized Table Implementation Guide

This guide demonstrates how to implement optimized, debounced search tables across all features in the application.

## Key Components

### 1. useOptimizedTableFilters Hook

```tsx
import { useOptimizedTableFilters } from '@/hooks/use-optimized-table-filters'

// Define your filter types
interface CourseFilters {
  status: 'active' | 'inactive' | 'all'
  categoryId: number | null
  level: string | null
}

// Use in your component
const tableFilters = useOptimizedTableFilters<CourseFilters>({
  searchDelay: 300, // Debounce delay
  initialSearch: '',
  initialFilters: {
    status: 'all',
    categoryId: null,
    level: null,
  },
})
```

### 2. OptimizedDataTable Component

```tsx
import { OptimizedDataTable } from '@/components/ui/optimized-data-table'

// Use in your feature component
<OptimizedDataTable
  columns={columns}
  data={data}
  isLoading={isLoading}
  searchPlaceholder="Search courses..."
  emptyMessage="No courses found."
  pagination={{
    page: tableFilters.page,
    perPage: tableFilters.perPage,
    total: response?.meta.total || 0,
    lastPage: response?.meta.last_page || 1,
    onPageChange: tableFilters.setPage,
    onPerPageChange: tableFilters.setPerPage,
  }}
  search={{
    value: tableFilters.search,
    onChange: tableFilters.handleSearchChange,
  }}
  toolbar={{
    leftContent: (
      <div className="flex items-center space-x-2">
        {/* Custom filters */}
        <Select 
          value={tableFilters.filters.status}
          onValueChange={(value) => tableFilters.handleFilterChange('status', value)}
        >
          {/* Select options */}
        </Select>
      </div>
    ),
    rightContent: (
      <Button onClick={openCreateDialog}>
        Add Course
      </Button>
    ),
  }}
  onResetFilters={tableFilters.resetFilters}
/>
```

### 3. Data Fetching with Optimized Queries

```tsx
import { useQuery } from '@tanstack/react-query'

const { data: coursesResponse, isLoading, error } = useQuery({
  queryKey: ['courses', tableFilters.page, tableFilters.perPage, tableFilters.debouncedSearch, tableFilters.filters],
  queryFn: () => coursesService.getCourses({
    page: tableFilters.page,
    perPage: tableFilters.perPage,
    search: tableFilters.debouncedSearch,
    ...tableFilters.filters
  }),
  staleTime: 1000 * 60 * 2, // 2 minutes
  gcTime: 1000 * 60 * 5, // 5 minutes
  retry: 1,
  retryDelay: 1000,
  refetchOnWindowFocus: false,
})
```

## Implementation Example: Users Feature

```tsx
// src/features/users/index.tsx
import { useOptimizedTableFilters } from '@/hooks/use-optimized-table-filters'
import { OptimizedDataTable } from '@/components/ui/optimized-data-table'

interface UserFilters {
  role: 'all' | 'admin' | 'instructor' | 'student'
  status: 'active' | 'inactive' | 'all'
  tenantId: number | null
}

export default function Users() {
  const tableFilters = useOptimizedTableFilters<UserFilters>({
    searchDelay: 300,
    initialFilters: {
      role: 'all',
      status: 'active',
      tenantId: null,
    },
  })

  const { data: usersResponse, isLoading } = useUsers({
    page: tableFilters.page,
    perPage: tableFilters.perPage,
    search: tableFilters.debouncedSearch,
    ...tableFilters.filters,
  })

  return (
    <div>
      <UserStats /> {/* Separate stats component with own query */}
      
      <OptimizedDataTable
        columns={userColumns}
        data={usersResponse?.data || []}
        isLoading={isLoading}
        searchPlaceholder="Search users..."
        pagination={{
          page: tableFilters.page,
          perPage: tableFilters.perPage,
          total: usersResponse?.meta.total || 0,
          lastPage: usersResponse?.meta.last_page || 1,
          onPageChange: tableFilters.setPage,
          onPerPageChange: tableFilters.setPerPage,
        }}
        search={{
          value: tableFilters.search,
          onChange: tableFilters.handleSearchChange,
        }}
        toolbar={{
          leftContent: (
            <UserFilters 
              filters={tableFilters.filters}
              onFilterChange={tableFilters.handleFilterChange}
            />
          ),
          rightContent: <CreateUserButton />,
        }}
        onResetFilters={tableFilters.resetFilters}
      />
    </div>
  )
}
```

## Benefits

1. **Performance**: Debounced search prevents excessive API calls
2. **User Experience**: Instant feedback with loading states
3. **Separation of Concerns**: Statistics don't reload during table operations
4. **Consistency**: Same behavior across all features
5. **Maintainability**: Reusable components and hooks
6. **Accessibility**: Proper loading states and keyboard navigation
7. **Caching**: Optimized React Query configuration

## Migration Steps

1. Replace existing table components with `OptimizedDataTable`
2. Replace filter state management with `useOptimizedTableFilters`
3. Update query configurations for better caching
4. Separate statistics components from table data
5. Add proper loading states and error handling

## Performance Metrics

- Search debounce: 300ms (configurable)
- Cache stale time: 2 minutes for data, 10 minutes for stats
- Retry strategy: 1 retry with 1 second delay
- Memory management: 5 minute garbage collection
