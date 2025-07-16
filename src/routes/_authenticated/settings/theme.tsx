import { useState, useEffect, useCallback } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  getThemeSettings,
  updateThemeSettings,
} from '@/services/tenant-settings'
import type { ThemeSettings } from '@/services/tenant-settings'
import { toast } from 'sonner'
import { useTenantTheme } from '@/context/tenant-theme-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TestThemeSwitch } from '@/components/test-theme-switch'

const themeSettingsSchema = z.object({
  mode: z.enum(['light', 'dark', 'system']),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    foreground: z.string(),
    card: z.string(),
    card_foreground: z.string(),
    popover: z.string(),
    popover_foreground: z.string(),
    muted: z.string(),
    muted_foreground: z.string(),
    border: z.string(),
    input: z.string(),
    ring: z.string(),
    destructive: z.string(),
    destructive_foreground: z.string(),
    success: z.string(),
    success_foreground: z.string(),
    warning: z.string(),
    warning_foreground: z.string(),
    info: z.string(),
    info_foreground: z.string(),
  }),
  typography: z.object({
    font_family: z.string(),
    font_sizes: z.object({
      xs: z.string(),
      sm: z.string(),
      base: z.string(),
      lg: z.string(),
      xl: z.string(),
      '2xl': z.string(),
      '3xl': z.string(),
      '4xl': z.string(),
      '5xl': z.string(),
      '6xl': z.string(),
    }),
    line_heights: z.object({
      none: z.string(),
      tight: z.string(),
      snug: z.string(),
      normal: z.string(),
      relaxed: z.string(),
      loose: z.string(),
    }),
    font_weights: z.object({
      thin: z.string(),
      light: z.string(),
      normal: z.string(),
      medium: z.string(),
      semibold: z.string(),
      bold: z.string(),
      extrabold: z.string(),
      black: z.string(),
    }),
  }),
  border_radius: z.object({
    none: z.string(),
    sm: z.string(),
    default: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
    '3xl': z.string(),
    full: z.string(),
  }),
  shadows: z.object({
    sm: z.string(),
    default: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
    inner: z.string(),
    none: z.string(),
  }),
  spacing: z.object({
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
    '3xl': z.string(),
    '4xl': z.string(),
    '5xl': z.string(),
  }),
})

type ThemeSettingsForm = z.infer<typeof themeSettingsSchema>

function ThemeSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Try to use tenant theme with fallback
  let themeMode = 'light'
  let setThemeMode = useCallback((_mode: 'light' | 'dark' | 'system') => {}, [])

  try {
    const tenantTheme = useTenantTheme()
    themeMode = tenantTheme.themeMode
    setThemeMode = tenantTheme.setThemeMode
  } catch {
    // If tenant theme context is not available, use default
  }

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ThemeSettingsForm>({
    resolver: zodResolver(themeSettingsSchema),
    defaultValues: {
      mode: (themeMode as 'light' | 'dark' | 'system') || 'light',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#10b981',
        background: '#ffffff',
        foreground: '#1f2937',
        card: '#ffffff',
        card_foreground: '#1f2937',
        popover: '#ffffff',
        popover_foreground: '#1f2937',
        muted: '#f8fafc',
        muted_foreground: '#64748b',
        border: '#e2e8f0',
        input: '#ffffff',
        ring: '#3b82f6',
        destructive: '#ef4444',
        destructive_foreground: '#ffffff',
        success: '#10b981',
        success_foreground: '#ffffff',
        warning: '#f59e0b',
        warning_foreground: '#ffffff',
        info: '#3b82f6',
        info_foreground: '#ffffff',
      },
      typography: {
        font_family: 'Inter, sans-serif',
        font_sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem',
          '6xl': '3.75rem',
        },
        line_heights: {
          none: '1',
          tight: '1.25',
          snug: '1.375',
          normal: '1.5',
          relaxed: '1.625',
          loose: '2',
        },
        font_weights: {
          thin: '100',
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
          extrabold: '800',
          black: '900',
        },
      },
      border_radius: {
        none: '0px',
        sm: '0.125rem',
        default: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        default:
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: '0 0 #0000',
      },
      spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        '4xl': '4rem',
        '5xl': '5rem',
      },
    },
  })

  // Helper functions for type-safe setValue calls
  const setColorValue = (
    key: keyof ThemeSettingsForm['colors'],
    value: string
  ) => {
    setValue(`colors.${key}`, value)
  }

  const setFontSizeValue = (
    key: keyof ThemeSettingsForm['typography']['font_sizes'],
    value: string
  ) => {
    setValue(`typography.font_sizes.${key}`, value)
  }

  const setFontWeightValue = (
    key: keyof ThemeSettingsForm['typography']['font_weights'],
    value: string
  ) => {
    setValue(`typography.font_weights.${key}`, value)
  }

  const setSpacingValue = (
    key: keyof ThemeSettingsForm['spacing'],
    value: string
  ) => {
    setValue(`spacing.${key}`, value)
  }

  const setBorderRadiusValue = (
    key: keyof ThemeSettingsForm['border_radius'],
    value: string
  ) => {
    setValue(`border_radius.${key}`, value)
  }

  const setShadowValue = (
    key: keyof ThemeSettingsForm['shadows'],
    value: string
  ) => {
    setValue(`shadows.${key}`, value)
  }

  // Mock data loading - replace with actual API call
  useState(() => {
    setTimeout(() => {
      setIsLoadingData(false)
    }, 1000)
  })

  // Load data from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getThemeSettings()
        const themeData = response.data

        // Set form values from API response
        if (themeData.mode) {
          setValue('mode', themeData.mode)
          setThemeMode(themeData.mode) // Apply theme immediately
        }
        if (themeData.colors) {
          Object.entries(themeData.colors).forEach(([key, value]) => {
            if (typeof value === 'string') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(`colors.${key}` as any, value)
            }
          })
        }
        if (themeData.typography) {
          if (themeData.typography.font_family) {
            setValue('typography.font_family', themeData.typography.font_family)
          }
          if (themeData.typography.font_sizes) {
            Object.entries(themeData.typography.font_sizes).forEach(
              ([key, value]) => {
                if (typeof value === 'string') {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setValue(`typography.font_sizes.${key}` as any, value)
                }
              }
            )
          }
          if (themeData.typography.line_heights) {
            Object.entries(themeData.typography.line_heights).forEach(
              ([key, value]) => {
                if (typeof value === 'string') {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setValue(`typography.line_heights.${key}` as any, value)
                }
              }
            )
          }
          if (themeData.typography.font_weights) {
            Object.entries(themeData.typography.font_weights).forEach(
              ([key, value]) => {
                if (typeof value === 'string') {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setValue(`typography.font_weights.${key}` as any, value)
                }
              }
            )
          }
        }
        if (themeData.border_radius) {
          Object.entries(themeData.border_radius).forEach(([key, value]) => {
            if (typeof value === 'string') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(`border_radius.${key}` as any, value)
            }
          })
        }
        if (themeData.shadows) {
          Object.entries(themeData.shadows).forEach(([key, value]) => {
            if (typeof value === 'string') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(`shadows.${key}` as any, value)
            }
          })
        }
        if (themeData.spacing) {
          Object.entries(themeData.spacing).forEach(([key, value]) => {
            if (typeof value === 'string') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(`spacing.${key}` as any, value)
            }
          })
        }

        setIsLoadingData(false)
      } catch (_error) {
        toast.error('Failed to load theme settings')
        setIsLoadingData(false)
      }
    }
    loadSettings()
  }, [setValue, setThemeMode])

  const onSubmit = async (data: ThemeSettingsForm) => {
    setIsLoading(true)
    try {
      // Transform the data to match the backend expected format
      const transformedData: ThemeSettings = {
        mode: data.mode,
        colors: data.colors,
        typography: data.typography,
        border_radius: data.border_radius,
        shadows: data.shadows,
        spacing: data.spacing,
      }

      await updateThemeSettings(transformedData)
      setThemeMode(data.mode) // Apply theme after successful save
      toast.success('Theme settings updated successfully!')
    } catch (_error) {
      toast.error('Failed to update theme settings')
    } finally {
      setIsLoading(false)
    }
  }

  const resetToDefaults = () => {
    setValue('mode', 'light')
    setThemeMode('light') // Apply theme immediately
    // Reset colors, typography, etc. to defaults
    toast.success('Theme reset to defaults')
  }

  if (isLoadingData) {
    return (
      <main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-6xl space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Theme Settings</h1>
              <p className='text-muted-foreground'>
                Customize the visual appearance of your tenant
              </p>
            </div>
          </div>
          <div className='grid gap-6'>
            <Card>
              <CardHeader>
                <div className='bg-muted h-6 w-48 animate-pulse rounded' />
                <div className='bg-muted h-4 w-96 animate-pulse rounded' />
              </CardHeader>
              <CardContent className='space-y-4'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='space-y-2'>
                    <div className='bg-muted h-4 w-24 animate-pulse rounded' />
                    <div className='bg-muted h-10 w-full animate-pulse rounded' />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Theme Settings</h1>
            <p className='text-muted-foreground'>
              Customize the visual appearance of your tenant
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
          </div>
        </div>

        {/* Test Theme Switch Component */}
        <TestThemeSwitch />

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Theme Mode</CardTitle>
              <CardDescription>
                Choose the default appearance mode for your tenant
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='mode'>Theme Mode</Label>
                <Select
                  value={watch('mode')}
                  onValueChange={(value: 'light' | 'dark' | 'system') => {
                    setValue('mode', value)
                    setThemeMode(value) // Apply theme immediately
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                  </SelectContent>
                </Select>
                {errors.mode && (
                  <p className='text-destructive text-sm'>
                    {errors.mode.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Theme Configuration</CardTitle>
              <CardDescription>
                Fine-tune colors, typography, and spacing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='colors' className='w-full'>
                <TabsList className='grid w-full grid-cols-5'>
                  <TabsTrigger value='colors'>Colors</TabsTrigger>
                  <TabsTrigger value='typography'>Typography</TabsTrigger>
                  <TabsTrigger value='spacing'>Spacing</TabsTrigger>
                  <TabsTrigger value='borders'>Borders</TabsTrigger>
                  <TabsTrigger value='shadows'>Shadows</TabsTrigger>
                </TabsList>

                <TabsContent value='colors' className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    {Object.entries(watch('colors')).map(([key, value]) => (
                      <div key={key} className='space-y-2'>
                        <Label htmlFor={key} className='capitalize'>
                          {key.replace('_', ' ')}
                        </Label>
                        <div className='flex gap-2'>
                          <Input
                            type='color'
                            value={value}
                            onChange={(e) =>
                              setColorValue(
                                key as keyof ThemeSettingsForm['colors'],
                                e.target.value
                              )
                            }
                            className='border-input h-10 w-16 rounded'
                          />
                          <Input
                            value={value}
                            onChange={(e) =>
                              setColorValue(
                                key as keyof ThemeSettingsForm['colors'],
                                e.target.value
                              )
                            }
                            placeholder='#000000'
                            className='flex-1'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value='typography' className='space-y-4'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='font_family'>Font Family</Label>
                      <Select
                        value={watch('typography.font_family')}
                        onValueChange={(value) =>
                          setValue('typography.font_family', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Inter, sans-serif'>
                            Inter
                          </SelectItem>
                          <SelectItem value='Roboto, sans-serif'>
                            Roboto
                          </SelectItem>
                          <SelectItem value='Open Sans, sans-serif'>
                            Open Sans
                          </SelectItem>
                          <SelectItem value='Lato, sans-serif'>Lato</SelectItem>
                          <SelectItem value='Montserrat, sans-serif'>
                            Montserrat
                          </SelectItem>
                          <SelectItem value='Poppins, sans-serif'>
                            Poppins
                          </SelectItem>
                          <SelectItem value='system-ui, sans-serif'>
                            System UI
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label className='text-sm font-medium'>
                          Font Sizes
                        </Label>
                        <div className='mt-2 space-y-2'>
                          {Object.entries(watch('typography.font_sizes')).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className='flex items-center gap-2'
                              >
                                <Label
                                  htmlFor={`font_size_${key}`}
                                  className='w-12 text-xs'
                                >
                                  {key}
                                </Label>
                                <Input
                                  id={`font_size_${key}`}
                                  value={value}
                                  onChange={(e) =>
                                    setFontSizeValue(
                                      key as keyof ThemeSettingsForm['typography']['font_sizes'],
                                      e.target.value
                                    )
                                  }
                                  className='flex-1'
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className='text-sm font-medium'>
                          Font Weights
                        </Label>
                        <div className='mt-2 space-y-2'>
                          {Object.entries(watch('typography.font_weights')).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className='flex items-center gap-2'
                              >
                                <Label
                                  htmlFor={`font_weight_${key}`}
                                  className='w-16 text-xs'
                                >
                                  {key}
                                </Label>
                                <Input
                                  id={`font_weight_${key}`}
                                  value={value}
                                  onChange={(e) =>
                                    setFontWeightValue(
                                      key as keyof ThemeSettingsForm['typography']['font_weights'],
                                      e.target.value
                                    )
                                  }
                                  className='flex-1'
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='spacing' className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    {Object.entries(watch('spacing')).map(([key, value]) => (
                      <div key={key} className='space-y-2'>
                        <Label
                          htmlFor={`spacing_${key}`}
                          className='capitalize'
                        >
                          {key}
                        </Label>
                        <Input
                          id={`spacing_${key}`}
                          value={value}
                          onChange={(e) =>
                            setSpacingValue(
                              key as keyof ThemeSettingsForm['spacing'],
                              e.target.value
                            )
                          }
                          placeholder='1rem'
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value='borders' className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    {Object.entries(watch('border_radius')).map(
                      ([key, value]) => (
                        <div key={key} className='space-y-2'>
                          <Label
                            htmlFor={`border_${key}`}
                            className='capitalize'
                          >
                            {key === 'default' ? 'Default' : key}
                          </Label>
                          <Input
                            id={`border_${key}`}
                            value={value}
                            onChange={(e) =>
                              setBorderRadiusValue(
                                key as keyof ThemeSettingsForm['border_radius'],
                                e.target.value
                              )
                            }
                            placeholder='0.25rem'
                          />
                        </div>
                      )
                    )}
                  </div>
                </TabsContent>

                <TabsContent value='shadows' className='space-y-4'>
                  <div className='space-y-4'>
                    {Object.entries(watch('shadows')).map(([key, value]) => (
                      <div key={key} className='space-y-2'>
                        <Label htmlFor={`shadow_${key}`} className='capitalize'>
                          {key === 'default' ? 'Default' : key}
                        </Label>
                        <Input
                          id={`shadow_${key}`}
                          value={value}
                          onChange={(e) =>
                            setShadowValue(
                              key as keyof ThemeSettingsForm['shadows'],
                              e.target.value
                            )
                          }
                          placeholder='0 1px 3px 0 rgb(0 0 0 / 0.1)'
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className='flex justify-end'>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/_authenticated/settings/theme')({
  component: ThemeSettings,
})
