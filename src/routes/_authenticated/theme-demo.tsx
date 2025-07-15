import { createFileRoute } from '@tanstack/react-router'
import { TenantThemeSelector } from '@/components/tenant-theme-selector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { TenantThemeSwitch } from '@/components/tenant-theme-selector'
import { useCurrentTenantTheme } from '@/context/tenant-theme-context'

export const Route = createFileRoute('/_authenticated/theme-demo')({
  component: ThemeDemo,
})

function ThemeDemo() {
  const currentTheme = useCurrentTenantTheme()

  return (
    <>
      <Header>
        <TopNav links={[
          {
              title: 'Dashboard', href: '/',
              isActive: false
          },
          {
              title: 'Theme Demo', href: '/theme-demo',
              isActive: false
          },
        ]} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <TenantThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold tracking-tight'>Multi-Tenant Theme System</h1>
          <p className='text-muted-foreground mt-2'>
            Dynamically switch between tenant themes and see the changes in real-time
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Theme Selector */}
          <div className='lg:col-span-1'>
            <TenantThemeSelector />
          </div>

          {/* Theme Preview Cards */}
          <div className='lg:col-span-2 space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Current Theme: {currentTheme.tenantName}</CardTitle>
                <CardDescription>
                  Company: {currentTheme.theme.branding.companyName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex gap-2'>
                    <Button>Primary Button</Button>
                    <Button variant='secondary'>Secondary</Button>
                    <Button variant='outline'>Outline</Button>
                  </div>
                  
                  <div className='flex gap-2'>
                    <Badge>Default Badge</Badge>
                    <Badge variant='secondary'>Secondary</Badge>
                    <Badge variant='outline'>Outline</Badge>
                  </div>
                  
                  <div className='p-4 bg-muted rounded-lg'>
                    <p className='text-muted-foreground'>
                      This is muted background with muted foreground text
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>
                  Current theme colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-4 gap-3'>
                  {Object.entries(currentTheme.theme.colors).map(([key, value]) => (
                    <div key={key} className='text-center'>
                      <div 
                        className='w-12 h-12 rounded-lg border mx-auto mb-2'
                        style={{ backgroundColor: value }}
                      />
                      <div className='text-xs font-medium'>{key}</div>
                      <div className='text-xs text-muted-foreground truncate'>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>
                  Font family and sizing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div style={{ fontFamily: currentTheme.theme.typography.fontFamily }}>
                    <div className='text-4xl font-bold'>Heading 1</div>
                    <div className='text-2xl font-semibold'>Heading 2</div>
                    <div className='text-lg font-medium'>Heading 3</div>
                    <div className='text-base'>Body text</div>
                    <div className='text-sm text-muted-foreground'>Small text</div>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Font Family: {currentTheme.theme.typography.fontFamily}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Usage Instructions */}
        <Card className='mt-8'>
          <CardHeader>
            <CardTitle>How to Use Multi-Tenant Theming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <h4 className='font-semibold mb-2'>1. Tenant Detection</h4>
                <p className='text-sm text-muted-foreground'>
                  Themes are automatically detected from subdomains (e.g., tenant1.yourapp.com) 
                  or URL paths (e.g., yourapp.com/tenant/tenant1)
                </p>
              </div>
              
              <div>
                <h4 className='font-semibold mb-2'>2. Theme Configuration</h4>
                <p className='text-sm text-muted-foreground'>
                  Each tenant can have custom colors, typography, branding, and even custom CSS
                </p>
              </div>
              
              <div>
                <h4 className='font-semibold mb-2'>3. Dynamic Switching</h4>
                <p className='text-sm text-muted-foreground'>
                  Switch between tenants using the selector above to see real-time theme changes
                </p>
              </div>
              
              <div>
                <h4 className='font-semibold mb-2'>4. Dark/Light Mode</h4>
                <p className='text-sm text-muted-foreground'>
                  Each tenant theme supports both light and dark mode variants
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
