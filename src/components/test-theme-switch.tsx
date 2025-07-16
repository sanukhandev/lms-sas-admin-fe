import { useTenantTheme } from '@/context/tenant-theme-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function TestThemeSwitch() {
  const { themeMode, setThemeMode } = useTenantTheme()

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setThemeMode(newMode)
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Theme Test</CardTitle>
        <CardDescription>Current theme: {themeMode}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <Button
            variant={themeMode === 'light' ? 'default' : 'outline'}
            onClick={() => handleThemeChange('light')}
          >
            Light
          </Button>
          <Button
            variant={themeMode === 'dark' ? 'default' : 'outline'}
            onClick={() => handleThemeChange('dark')}
          >
            Dark
          </Button>
          <Button
            variant={themeMode === 'system' ? 'default' : 'outline'}
            onClick={() => handleThemeChange('system')}
          >
            System
          </Button>
        </div>
        <div className='text-muted-foreground text-sm'>
          This card should change appearance when you switch themes.
        </div>
        <div className='rounded border p-4'>
          <p className='text-foreground'>Foreground text</p>
          <p className='text-muted-foreground'>Muted text</p>
          <div className='bg-muted mt-2 rounded p-2'>
            <p className='text-muted-foreground'>Muted background</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
