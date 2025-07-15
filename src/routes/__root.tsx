import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'
import { AuthProvider } from '@/context/auth-context'
import { TenantProvider } from '@/context/tenant-context'
import { TenantLoader } from '@/components/tenant-loader'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async () => {
    // Redirect to sign-in by default
    if (window.location.pathname === '/') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: () => {
    return (
      <TenantProvider>
        <TenantLoader>
          <AuthProvider>
            <NavigationProgress />
            <Outlet />
            <Toaster duration={50000} />
            {import.meta.env.MODE === 'development' && (
              <>
                <ReactQueryDevtools buttonPosition='bottom-left' />
                <TanStackRouterDevtools position='bottom-right' />
              </>
            )}
          </AuthProvider>
        </TenantLoader>
      </TenantProvider>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
