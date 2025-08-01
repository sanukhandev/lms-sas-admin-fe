import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTenantStore } from '@/stores/tenant-store'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'

const topNav = [
  { title: 'Dashboard', href: '/home', isActive: true },
  { title: 'Users', href: '/users', isActive: false },
  { title: 'Courses', href: '/courses', isActive: false },
  { title: 'Analytics', href: '/analytics', isActive: false },
]

export default function IntegratedDashboard() {
  const { currentTenant } = useTenantStore()

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {currentTenant?.settings?.branding?.company_name || currentTenant?.name
                ? `Welcome back! Here's what's happening with ${currentTenant?.settings?.branding?.company_name || currentTenant?.name}.`
                : "Welcome back! Here's what's happening with your learning platform."}
            </h2>
            <p className='text-muted-foreground'>
              Monitor your learning platform performance and user engagement
            </p>
          </div>
        </div>

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='courses'>Courses</TabsTrigger>
            <TabsTrigger value='users'>Users</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <Overview />
          </TabsContent>

          <TabsContent value='courses' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>
                  Track course enrollment and completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>Coming Soon</div>
                <p className='text-muted-foreground text-xs'>
                  Detailed course analytics and performance metrics
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='users' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage learners and track their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>Coming Soon</div>
                <p className='text-muted-foreground text-xs'>
                  User analytics and management tools
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Deep dive into learning platform analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>Coming Soon</div>
                <p className='text-muted-foreground text-xs'>
                  Advanced reporting and analytics features
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
