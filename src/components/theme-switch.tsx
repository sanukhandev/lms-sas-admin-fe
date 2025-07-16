import { useEffect } from 'react'
import { IconCheck, IconMoon, IconSun } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useTenantTheme } from '@/context/tenant-theme-context'
import { useTheme } from '@/context/theme-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  // Try to use tenant theme if available, fallback to global theme
  let currentTheme = theme
  let setCurrentTheme = setTheme

  try {
    const tenantTheme = useTenantTheme()
    if (tenantTheme) {
      currentTheme = tenantTheme.themeMode
      setCurrentTheme = tenantTheme.setThemeMode
    }
  } catch {
    // If tenant theme context is not available, use global theme
  }

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = currentTheme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [currentTheme])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full'>
          <IconSun className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <IconMoon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setCurrentTheme('light')}>
          Light{' '}
          <IconCheck
            size={14}
            className={cn('ml-auto', currentTheme !== 'light' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrentTheme('dark')}>
          Dark
          <IconCheck
            size={14}
            className={cn('ml-auto', currentTheme !== 'dark' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrentTheme('system')}>
          System
          <IconCheck
            size={14}
            className={cn('ml-auto', currentTheme !== 'system' && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
