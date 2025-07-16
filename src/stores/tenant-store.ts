import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  TenantConfig,
  TenantDetectionService,
  TenantDetectionResult,
} from '../services/tenant-detection'

interface TenantState {
  currentTenant: TenantConfig | null
  isLoading: boolean
  error: string | null
  detectionMethod: string | null
  isInitialized: boolean
}

interface TenantActions {
  initializeTenant: () => Promise<void>
  setTenant: (tenant: TenantConfig) => void
  clearTenant: () => void
  applyBranding: () => void
  refreshTenant: () => Promise<void>
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

type TenantStore = TenantState & TenantActions

export const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTenant: null,
      isLoading: false,
      error: null,
      detectionMethod: null,
      isInitialized: false,

      // Actions
      initializeTenant: async () => {
        console.log('🏪 [TenantStore] initializeTenant called')
        set({ isLoading: true, error: null })

        try {
          console.log(
            '🏪 [TenantStore] Calling TenantDetectionService.initializeTenant()'
          )
          const result: TenantDetectionResult =
            await TenantDetectionService.initializeTenant()

          console.log('🏪 [TenantStore] TenantDetectionService result:', result)

          if (result.isValid && result.tenant) {
            console.log('🏪 [TenantStore] Setting valid tenant in store:', {
              tenantName: result.tenant.name,
              tenantId: result.tenant.id,
              detectionMethod: result.detectionMethod,
            })

            set({
              currentTenant: result.tenant,
              detectionMethod: result.detectionMethod,
              isLoading: false,
              error: null,
              isInitialized: true,
            })

            // Apply branding
            console.log('🏪 [TenantStore] Applying tenant branding')
            TenantDetectionService.applyTenantBranding(result.tenant)
          } else {
            console.error('🏪 [TenantStore] Invalid tenant result:', result)
            set({
              currentTenant: null,
              detectionMethod: result.detectionMethod,
              isLoading: false,
              error: result.error || 'Failed to initialize tenant',
              isInitialized: true,
            })
          }
        } catch (error: any) {
          console.error(
            '🏪 [TenantStore] Error during tenant initialization:',
            error
          )
          set({
            currentTenant: null,
            detectionMethod: null,
            isLoading: false,
            error: error.message || 'Failed to initialize tenant',
            isInitialized: true,
          })
        }
      },

      setTenant: (tenant: TenantConfig) => {
        set({
          currentTenant: tenant,
          error: null,
          isInitialized: true,
        })

        // Store in localStorage
        localStorage.setItem('current_tenant', JSON.stringify(tenant))

        // Apply branding
        TenantDetectionService.applyTenantBranding(tenant)
      },

      clearTenant: () => {
        set({
          currentTenant: null,
          error: null,
          detectionMethod: null,
          isInitialized: false,
        })

        // Clear localStorage
        TenantDetectionService.clearTenantData()
      },

      applyBranding: () => {
        const { currentTenant } = get()
        if (currentTenant) {
          TenantDetectionService.applyTenantBranding(currentTenant)
        }
      },

      refreshTenant: async () => {
        const { currentTenant } = get()
        if (currentTenant) {
          set({ isLoading: true, error: null })

          try {
            const updatedTenant =
              await TenantDetectionService.fetchTenantConfig(
                currentTenant.domain
              )

            if (updatedTenant) {
              set({
                currentTenant: updatedTenant,
                isLoading: false,
                error: null,
              })

              // Apply updated branding
              TenantDetectionService.applyTenantBranding(updatedTenant)
            } else {
              set({
                isLoading: false,
                error: 'Failed to refresh tenant configuration',
              })
            }
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Failed to refresh tenant',
            })
          }
        }
      },

      setError: (error: string | null) => set({ error }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'tenant-storage',
      partialize: (state) => ({
        currentTenant: state.currentTenant,
        detectionMethod: state.detectionMethod,
        isInitialized: state.isInitialized,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error(
              '🏪 [TenantStore] Error rehydrating tenant store:',
              error
            )
            return
          }

          // Reapply theme immediately after hydration
          if (state?.currentTenant) {
            console.log(
              '🏪 [TenantStore] Reapplying theme after hydration for tenant:',
              state.currentTenant.name
            )
            TenantDetectionService.applyTenantBranding(state.currentTenant)
          }
        }
      },
    }
  )
)

// Helper hook for easier access to tenant data
export const useTenant = () => {
  const store = useTenantStore()
  return {
    tenant: store.currentTenant,
    isLoading: store.isLoading,
    error: store.error,
    detectionMethod: store.detectionMethod,
    isInitialized: store.isInitialized,
    initializeTenant: store.initializeTenant,
    setTenant: store.setTenant,
    clearTenant: store.clearTenant,
    applyBranding: store.applyBranding,
    refreshTenant: store.refreshTenant,
  }
}
