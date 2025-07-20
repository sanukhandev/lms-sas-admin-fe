# Frontend Module Design Guide

A comprehensive guide for creating consistent, maintainable modules in the shadcn-admin frontend application.

## Table of Contents

1. [Module Architecture Overview](#module-architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Core Patterns](#core-patterns)
4. [Step-by-Step Module Creation](#step-by-step-module-creation)
5. [Components Breakdown](#components-breakdown)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Routing Setup](#routing-setup)
9. [Best Practices](#best-practices)
10. [Testing Patterns](#testing-patterns)

## Module Architecture Overview

The application follows a **feature-based architecture** where each module is self-contained with its own components, hooks, services, and state management. This promotes:

- **Separation of Concerns**: Each module handles its own business logic
- **Reusability**: Components and hooks can be shared across modules
- **Maintainability**: Changes to one module don't affect others
- **Scalability**: New modules can be added without affecting existing ones

### Tech Stack
- **React 18** with TypeScript
- **TanStack Router** for routing
- **TanStack Query** for server state management
- **Zustand** for client state management
- **shadcn/ui** for UI components
- **TanStack Table** for data tables
- **Zod** for schema validation

## Directory Structure

Each module follows this standardized structure:

```
src/
├── features/
│   └── [module-name]/                 # Feature module
│       ├── components/                # Module-specific components
│       │   ├── [module]-columns.tsx   # Table column definitions
│       │   ├── [module]-table.tsx     # Main data table component
│       │   ├── [module]-dialogs.tsx   # Dialog container
│       │   ├── [module]-primary-buttons.tsx # Action buttons
│       │   ├── [module]-stats.tsx     # Statistics/overview component
│       │   ├── [module]-create-dialog.tsx   # Create modal
│       │   ├── [module]-edit-dialog.tsx     # Edit modal
│       │   ├── [module]-delete-dialog.tsx   # Delete confirmation
│       │   ├── [module]-view-dialog.tsx     # View details modal
│       │   └── data-table-*.tsx       # Reusable table components
│       ├── context/                   # Module context providers
│       │   └── [module]-context.tsx   # State management context
│       ├── data/                      # Data schemas and types
│       │   └── schema.ts              # Zod schemas and TypeScript types
│       ├── hooks/                     # Module-specific hooks (optional)
│       │   └── use-[module]-specific.ts
│       └── index.tsx                  # Main module component
├── hooks/                             # Global hooks
│   ├── use-[module].ts                # API hooks for module
│   └── use-optimized-table-filters.ts # Table filtering hook
├── services/                          # API services
│   └── [module].ts                    # API service for module
└── routes/                           # Routing
    └── _authenticated/
        └── [module]/
            └── index.tsx              # Route definition
```

## Core Patterns

### 1. Module Entry Point Pattern
```tsx
// src/features/[module]/index.tsx
export default function ModuleName() {
  const tableFilters = useOptimizedTableFilters<ModuleFilters>({
    searchDelay: 300,
    initialSearch: '',
    initialFilters: {
      // module-specific filters
    },
  })

  const { data: moduleResponse, isLoading, error } = useModule({
    page: tableFilters.page,
    perPage: tableFilters.perPage,
    search: tableFilters.debouncedSearch,
    ...tableFilters.filters,
  })

  return (
    <ModuleProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <ModuleStats />
        
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Module Title</h2>
            <p className='text-muted-foreground'>Module description</p>
          </div>
          <ModulePrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {error ? (
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center text-red-500'>
                  Failed to load data. Please try again.
                </div>
              </CardContent>
            </Card>
          ) : (
            <ModuleTable 
              data={moduleList} 
              columns={columns}
              isLoading={isLoading}
              pagination={{
                page: tableFilters.page,
                perPage: tableFilters.perPage,
                total: moduleResponse?.meta.total || 0,
                lastPage: moduleResponse?.meta.last_page || 1,
                onPageChange: tableFilters.setPage,
                onPerPageChange: tableFilters.setPerPage,
              }}
              filters={{
                search: tableFilters.search,
                ...tableFilters.filters,
                onSearchChange: tableFilters.handleSearchChange,
                // specific filter handlers
              }}
            />
          )}
        </div>
      </Main>

      <ModuleDialogs />
    </ModuleProvider>
  )
}
```

### 2. Context Provider Pattern
```tsx
// src/features/[module]/context/[module]-context.tsx
interface ModuleContextType {
  selectedItem: ModuleItem | null
  setSelectedItem: (item: ModuleItem | null) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined)

export function useModuleContext() {
  const context = useContext(ModuleContext)
  if (!context) {
    throw new Error('useModuleContext must be used within a ModuleProvider')
  }
  return context
}

export default function ModuleProvider({ children }: { children: ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<ModuleItem | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  return (
    <ModuleContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isViewDialogOpen,
        setIsViewDialogOpen,
      }}
    >
      {children}
    </ModuleContext.Provider>
  )
}
```

### 3. API Service Pattern
```tsx
// src/services/[module].ts
import { api } from '@/lib/api'

export interface ModuleItem {
  id: number
  name: string
  // other properties
  created_at: string
  updated_at: string
}

export interface ModuleStats {
  data: {
    total: number
    active: number
    // other stats
  }
}

export interface ModuleResponse {
  data: ModuleItem[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface CreateModuleRequest {
  name: string
  // other required fields
}

export interface UpdateModuleRequest {
  name?: string
  // other optional fields
}

export const moduleService = {
  async getItems(
    page: number = 1,
    perPage: number = 15,
    search?: string,
    // other filters
  ): Promise<ModuleResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })

    if (search) params.append('search', search)
    // Add other filters

    const response = await api.get<ModuleResponse>(
      `/v1/module?${params.toString()}`
    )
    return response.data
  },

  async getItem(id: number): Promise<{ data: ModuleItem }> {
    const response = await api.get<{ data: ModuleItem }>(`/v1/module/${id}`)
    return response.data
  },

  async getStats(): Promise<ModuleStats> {
    const response = await api.get<ModuleStats>('/v1/module/stats')
    return response.data
  },

  async create(data: CreateModuleRequest): Promise<{ data: ModuleItem }> {
    const response = await api.post<{ data: ModuleItem }>('/v1/module', data)
    return response.data
  },

  async update(id: number, data: UpdateModuleRequest): Promise<{ data: ModuleItem }> {
    const response = await api.put<{ data: ModuleItem }>(`/v1/module/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/v1/module/${id}`)
  },
}
```

### 4. Hook Pattern
```tsx
// src/hooks/use-[module].ts
import { useQuery } from '@tanstack/react-query'
import { moduleService, type ModuleResponse, type ModuleStats } from '@/services/module'

interface UseModuleParams {
  page: number
  perPage: number
  search?: string
  // other filters
}

export function useModule(params: UseModuleParams, options?: { enabled?: boolean; staleTime?: number }) {
  return useQuery<ModuleResponse>({
    queryKey: ['module', params],
    queryFn: () => moduleService.getItems(
      params.page,
      params.perPage,
      params.search,
      // other filters
    ),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    ...options,
  })
}

export function useModuleItem(id: number) {
  return useQuery({
    queryKey: ['module', id],
    queryFn: () => moduleService.getItem(id),
    enabled: !!id,
  })
}

export function useModuleStats() {
  return useQuery<ModuleStats>({
    queryKey: ['moduleStats'],
    queryFn: () => moduleService.getStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  })
}
```

## Step-by-Step Module Creation

### Step 1: Define the Data Schema
```tsx
// src/features/[module]/data/schema.ts
import { z } from 'zod'

const moduleItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(['active', 'inactive']),
  created_at: z.string(),
  updated_at: z.string(),
  // other fields
})

export type ModuleItem = z.infer<typeof moduleItemSchema>
export const moduleItemListSchema = z.array(moduleItemSchema)

// Define filter types
export interface ModuleFilters {
  status?: string
  // other filters
}
```

### Step 2: Create the API Service
```tsx
// src/services/[module].ts
// Follow the API Service Pattern above
```

### Step 3: Create API Hooks
```tsx
// src/hooks/use-[module].ts
// Follow the Hook Pattern above
```

### Step 4: Create Context Provider
```tsx
// src/features/[module]/context/[module]-context.tsx
// Follow the Context Provider Pattern above
```

### Step 5: Create Table Columns
```tsx
// src/features/[module]/components/[module]-columns.tsx
import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { type ModuleItem } from '../data/schema'

export const columns: ColumnDef<ModuleItem>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
```

### Step 6: Create Table Component
```tsx
// src/features/[module]/components/[module]-table.tsx
// Follow the structure from categories-table.tsx with module-specific types
```

### Step 7: Create Dialog Components
```tsx
// src/features/[module]/components/[module]-dialogs.tsx
import { ModuleCreateDialog } from './[module]-create-dialog'
import { ModuleEditDialog } from './[module]-edit-dialog'
import { ModuleDeleteDialog } from './[module]-delete-dialog'
import { ModuleViewDialog } from './[module]-view-dialog'

export function ModuleDialogs() {
  return (
    <>
      <ModuleCreateDialog />
      <ModuleEditDialog />
      <ModuleDeleteDialog />
      <ModuleViewDialog />
    </>
  )
}
```

### Step 8: Create Stats Component
```tsx
// src/features/[module]/components/[module]-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useModuleStats } from '@/hooks/use-module'

export function ModuleStats() {
  const { data: stats, isLoading } = useModuleStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.data.total || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.data.active || 0}</div>
        </CardContent>
      </Card>
      {/* Add more stat cards */}
    </div>
  )
}
```

### Step 9: Create Primary Buttons Component
```tsx
// src/features/[module]/components/[module]-primary-buttons.tsx
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useModuleContext } from '../context/[module]-context'

export function ModulePrimaryButtons() {
  const { setIsCreateDialogOpen } = useModuleContext()

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  )
}
```

### Step 10: Create Main Module Component
```tsx
// src/features/[module]/index.tsx
// Follow the Module Entry Point Pattern above
```

### Step 11: Create Route
```tsx
// src/routes/_authenticated/[module]/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import Module from '@/features/module'

export const Route = createFileRoute('/_authenticated/module/')({
  component: Module,
})
```

## Components Breakdown

### Required Components for Each Module

1. **[module]-columns.tsx** - Table column definitions
2. **[module]-table.tsx** - Main data table with pagination and filtering
3. **[module]-dialogs.tsx** - Container for all dialogs
4. **[module]-primary-buttons.tsx** - Action buttons (Create, Export, etc.)
5. **[module]-stats.tsx** - Statistics overview cards
6. **[module]-create-dialog.tsx** - Create new item modal
7. **[module]-edit-dialog.tsx** - Edit existing item modal
8. **[module]-delete-dialog.tsx** - Delete confirmation modal
9. **[module]-view-dialog.tsx** - View item details modal

### Shared Data Table Components

These components are shared across modules and should be copied to each module's components folder:

1. **data-table-column-header.tsx** - Sortable column headers
2. **data-table-pagination.tsx** - Pagination controls
3. **data-table-row-actions.tsx** - Row action dropdown
4. **data-table-toolbar.tsx** - Table toolbar with filters and search
5. **data-table-faceted-filter.tsx** - Multi-select filter component
6. **data-table-view-options.tsx** - Column visibility toggle

## State Management

### Context vs Global State

- **Use Context for**: Module-specific UI state (dialog open/closed, selected items)
- **Use Zustand for**: Cross-module state (user auth, tenant data, themes)
- **Use TanStack Query for**: Server state (API data, caching, background updates)

### Context State Structure
```tsx
interface ModuleContextType {
  // Selected item for actions
  selectedItem: ModuleItem | null
  setSelectedItem: (item: ModuleItem | null) => void
  
  // Dialog states
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
  
  // Optional: Form states, loading states, etc.
}
```

## API Integration

### Query Key Conventions
```tsx
// List queries
['module', { page, perPage, search, ...filters }]

// Individual item queries
['module', id]

// Stats queries
['moduleStats']

// Related data queries
['moduleRelated', moduleId, relationType]
```

### Error Handling
```tsx
const { data, isLoading, error } = useModule(params)

// In component
{error ? (
  <Card>
    <CardContent className='pt-6'>
      <div className='text-center text-red-500'>
        Failed to load data. Please try again.
      </div>
    </CardContent>
  </Card>
) : (
  // Success UI
)}
```

### Mutation Patterns
```tsx
// src/hooks/use-[module]-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moduleService } from '@/services/module'

export function useCreateModule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: moduleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module'] })
      queryClient.invalidateQueries({ queryKey: ['moduleStats'] })
    },
  })
}

export function useUpdateModule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateModuleRequest }) =>
      moduleService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['module'] })
      queryClient.invalidateQueries({ queryKey: ['module', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['moduleStats'] })
    },
  })
}

export function useDeleteModule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: moduleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module'] })
      queryClient.invalidateQueries({ queryKey: ['moduleStats'] })
    },
  })
}
```

## Routing Setup

### Route File Structure
```
src/routes/_authenticated/[module]/
├── index.tsx           # Main list view
├── create.tsx          # Create page (optional)
├── $id.tsx            # Detail view (optional)
└── $id.edit.tsx       # Edit page (optional)
```

### Basic Route Setup
```tsx
// src/routes/_authenticated/[module]/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import Module from '@/features/module'

export const Route = createFileRoute('/_authenticated/module/')({
  component: Module,
})
```

### Route with Search Params
```tsx
// For advanced filtering
import { z } from 'zod'

const moduleSearchSchema = z.object({
  page: z.number().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/module/')({
  component: Module,
  validateSearch: moduleSearchSchema,
})
```

## Best Practices

### 1. Naming Conventions
- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Hooks**: camelCase starting with 'use' (`useUserProfile`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `UserProfileResponse`)
- **Variables**: camelCase (`userProfile`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### 2. Component Organization
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Prefer function components over class components

### 3. Type Safety
- Use TypeScript for all files
- Define interfaces for all API responses
- Use Zod schemas for runtime validation
- Avoid `any` type - use `unknown` when type is uncertain

### 4. Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Use useMemo/useCallback for expensive computations
- Implement proper loading states and error boundaries

### 5. Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Use semantic HTML elements

### 6. Error Handling
- Implement error boundaries for components
- Show user-friendly error messages
- Log errors for debugging
- Provide fallback UI for failed states

### 7. Code Organization
- Group related files together
- Use barrel exports (index.ts files)
- Keep file sizes reasonable (< 300 lines)
- Separate concerns properly

## Testing Patterns

### Unit Tests
```tsx
// src/features/[module]/components/__tests__/[module]-table.test.tsx
import { render, screen } from '@testing-library/react'
import { ModuleTable } from '../[module]-table'

describe('ModuleTable', () => {
  it('renders table with data', () => {
    const mockData = [
      { id: 1, name: 'Test Item', status: 'active' }
    ]
    
    render(
      <ModuleTable 
        data={mockData}
        columns={mockColumns}
        isLoading={false}
        pagination={mockPagination}
        filters={mockFilters}
      />
    )
    
    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })
})
```

### Integration Tests
```tsx
// src/features/[module]/__tests__/module.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Module from '../index'

describe('Module Integration', () => {
  it('loads and displays data', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    
    render(
      <QueryClientProvider client={queryClient}>
        <Module />
      </QueryClientProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Module Title')).toBeInTheDocument()
    })
  })
})
```

## Conclusion

This guide provides a comprehensive framework for building consistent, maintainable modules in the shadcn-admin frontend. By following these patterns and conventions, you ensure:

- **Consistency** across all modules
- **Maintainability** through clear separation of concerns
- **Reusability** of components and patterns
- **Scalability** for future development
- **Type Safety** throughout the application
- **Performance** through optimized patterns

Remember to:
1. Always start with the data schema
2. Build the API service layer first
3. Create hooks for data fetching
4. Implement the UI components
5. Add proper error handling and loading states
6. Write tests for critical functionality
7. Document any module-specific patterns or deviations

For questions or improvements to this guide, please contribute to the documentation or reach out to the development team.
