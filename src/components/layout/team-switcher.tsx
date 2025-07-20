import * as React from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useTenantStore } from '@/stores/tenant-store'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const [activeTeam] = React.useState(teams[0])
  const { currentTenant } = useTenantStore()
  const { user } = useAuthStore()

  // Use tenant information if available, otherwise fallback to default
  const displayName = currentTenant?.name || activeTeam.name
  const displayLogo = currentTenant?.settings?.branding?.logo
  const userRole = user?.role || 'Guest'

  // State to handle image loading errors
  const [imageError, setImageError] = React.useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Simple tenant display without dropdown */}
        <SidebarMenuButton
          size='lg'
          className='cursor-default hover:bg-transparent'
          asChild
        >
          <div>
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              {displayLogo && !imageError ? (
                <img
                  src={displayLogo}
                  alt={`${displayName} logo`}
                  className='size-6 rounded object-cover'
                  onError={handleImageError}
                />
              ) : (
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-6 items-center justify-center rounded text-xs font-semibold'>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{displayName}</span>
              <span className='truncate text-xs capitalize'>{userRole}</span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
