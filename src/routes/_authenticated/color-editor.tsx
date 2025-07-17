import { createFileRoute } from '@tanstack/react-router'
import { Code, Database, Palette, Settings, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ColorPaletteEditor } from '@/components/color-palette-editor'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { TenantThemeSwitch } from '@/components/tenant-theme-selector'

export const Route = createFileRoute('/_authenticated/color-editor')({
  component: ColorEditorPage,
})

function ColorEditorPage() {
  return (
    <>
      <Header>
        <TopNav
          links={[
            {
              title: 'Dashboard',
              href: '/',
              isActive: false,
            },
            {
              title: 'Theme Demo',
              href: '/theme-demo',
              isActive: false,
            },
            {
              title: 'Color Editor',
              href: '/color-editor',
              isActive: false,
            },
          ]}
        />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <TenantThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold tracking-tight'>
            API-Based Color Palette Editor
          </h1>
          <p className='text-muted-foreground mt-2'>
            Manage tenant color palettes with real-time API integration
          </p>
        </div>

        <Tabs defaultValue='editor' className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='editor'>Color Editor</TabsTrigger>
            <TabsTrigger value='api'>API Usage</TabsTrigger>
            <TabsTrigger value='examples'>Examples</TabsTrigger>
            <TabsTrigger value='integration'>Integration</TabsTrigger>
          </TabsList>

          <TabsContent value='editor' className='space-y-6'>
            <ColorPaletteEditor />
          </TabsContent>

          <TabsContent value='api' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Database className='h-5 w-5' />
                    API Endpoints
                  </CardTitle>
                  <CardDescription>
                    Available endpoints for color palette management
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Badge variant='outline'>GET</Badge>
                    <code className='text-sm'>/api/theme/color-palettes</code>
                    <p className='text-muted-foreground text-xs'>
                      Get all available color palettes
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Badge variant='outline'>PATCH</Badge>
                    <code className='text-sm'>
                      /api/tenants/{'{tenantId}'}/theme/colors
                    </code>
                    <p className='text-muted-foreground text-xs'>
                      Update tenant color palette
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Badge variant='outline'>POST</Badge>
                    <code className='text-sm'>/api/theme/generate-palette</code>
                    <p className='text-muted-foreground text-xs'>
                      Generate palette from primary color
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Badge variant='outline'>POST</Badge>
                    <code className='text-sm'>
                      /api/tenants/{'{tenantId}'}/theme/preview
                    </code>
                    <p className='text-muted-foreground text-xs'>
                      Preview color changes
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Code className='h-5 w-5' />
                    Usage Example
                  </CardTitle>
                  <CardDescription>
                    How to update colors programmatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className='bg-muted overflow-x-auto rounded-lg p-4 text-xs'>
                    {`// Update color palette
const response = await fetch('/v1/tenants/tenant-1/theme/colors', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    colors: {
      primary: 'oklch(0.55 0.24 262.4)',
      secondary: 'oklch(0.968 0.007 247.896)',
      accent: 'oklch(0.55 0.24 262.4)'
    },
    darkModeColors: {
      primary: 'oklch(0.75 0.2 262.4)',
      secondary: 'oklch(0.208 0.042 265.755)',
      accent: 'oklch(0.4 0.2 262.4)'
    }
  })
});`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='examples' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-3'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Palette className='h-5 w-5' />
                    Corporate Blue
                  </CardTitle>
                  <CardDescription>Professional blue theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='mb-4 flex gap-2'>
                    <div
                      className='h-8 w-8 rounded-md border'
                      style={{ backgroundColor: '#3b82f6' }}
                    />
                    <div
                      className='h-8 w-8 rounded-md border'
                      style={{ backgroundColor: '#1e40af' }}
                    />
                    <div
                      className='h-8 w-8 rounded-md border'
                      style={{ backgroundColor: '#dbeafe' }}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Button size='sm' className='w-full'>
                      Primary Button
                    </Button>
                    <Button size='sm' variant='outline' className='w-full'>
                      Secondary
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Palette className='h-5 w-5' />
                    Nature Green
                  </CardTitle>
                  <CardDescription>Fresh green theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='mb-4 flex gap-2'>
                    <div
                      className='h-8 w-8 rounded-md border'
                      style={{ backgroundColor: '#10b981' }}
                    />
                    <div
                      className='h-8 w-8 rounded-md border'
                      style={{ backgroundColor: '#059669' }}
                    />
                    <div
                      className='h-8 w-8 rounded-md border'
                      style={{ backgroundColor: '#d1fae5' }}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Button size='sm' className='w-full'>
                      Primary Button
                    </Button>
                    <Button size='sm' variant='outline' className='w-full'>
                      Secondary
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Palette className='h-5 w-5' />
                    Sunset Orange
                  </CardTitle>
                  <CardDescription>Warm orange theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='mb-4 flex gap-2'>
                    <div
                      className='h-8 w-8 rounded-md border'
                      style={{ backgroundColor: '#f97316' }}
                    />
                    <div
                      className='h-8 w-8 rounded-md border'
                      style={{ backgroundColor: '#ea580c' }}
                    />
                    <div
                      className='h-8 w-8 rounded-md border'
                      style={{ backgroundColor: '#fed7aa' }}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Button size='sm' className='w-full'>
                      Primary Button
                    </Button>
                    <Button size='sm' variant='outline' className='w-full'>
                      Secondary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='integration' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Settings className='h-5 w-5' />
                  Integration Steps
                </CardTitle>
                <CardDescription>
                  How to integrate the color palette API into your application
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-3'>
                  <div className='flex items-start gap-3'>
                    <div className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold'>
                      1
                    </div>
                    <div>
                      <h4 className='font-medium'>Setup API Client</h4>
                      <p className='text-muted-foreground text-sm'>
                        Configure axios or fetch client with authentication
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold'>
                      2
                    </div>
                    <div>
                      <h4 className='font-medium'>Load Color Palettes</h4>
                      <p className='text-muted-foreground text-sm'>
                        Fetch available palettes from the API
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold'>
                      3
                    </div>
                    <div>
                      <h4 className='font-medium'>Update Theme Store</h4>
                      <p className='text-muted-foreground text-sm'>
                        Integrate with Zustand store for state management
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold'>
                      4
                    </div>
                    <div>
                      <h4 className='font-medium'>Apply CSS Variables</h4>
                      <p className='text-muted-foreground text-sm'>
                        Dynamically update CSS custom properties
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold'>
                      5
                    </div>
                    <div>
                      <h4 className='font-medium'>Handle Persistence</h4>
                      <p className='text-muted-foreground text-sm'>
                        Save changes to the backend and localStorage
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Zap className='h-5 w-5' />
                  Features
                </CardTitle>
                <CardDescription>
                  What's included in the color palette system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>🎨 Preset Palettes</h4>
                    <p className='text-muted-foreground text-sm'>
                      Pre-built color combinations for quick setup
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='font-medium'>🤖 AI Generation</h4>
                    <p className='text-muted-foreground text-sm'>
                      Generate palettes from a single primary color
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='font-medium'>🛠️ Custom Editor</h4>
                    <p className='text-muted-foreground text-sm'>
                      Fine-tune individual color values
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='font-medium'>👁️ Live Preview</h4>
                    <p className='text-muted-foreground text-sm'>
                      See changes in real-time
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='font-medium'>🌓 Dark Mode</h4>
                    <p className='text-muted-foreground text-sm'>
                      Separate palettes for light and dark themes
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='font-medium'>💾 Auto-save</h4>
                    <p className='text-muted-foreground text-sm'>
                      Automatic persistence to backend
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
