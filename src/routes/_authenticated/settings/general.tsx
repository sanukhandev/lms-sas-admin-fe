import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  getGeneralSettings,
  updateGeneralSettings,
} from '@/services/tenant-settings'
import type { GeneralSettings } from '@/services/tenant-settings'
import { toast } from 'sonner'
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
import { Textarea } from '@/components/ui/textarea'

const generalSettingsSchema = z.object({
  name: z.string().min(1, 'Tenant name is required'),
  domain: z.string().min(1, 'Domain is required'),
  description: z.string().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
  date_format: z.string().min(1, 'Date format is required'),
  time_format: z.string().min(1, 'Time format is required'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  max_users: z.number().min(1, 'Max users must be at least 1'),
  max_courses: z.number().min(1, 'Max courses must be at least 1'),
  storage_limit: z.number().min(100, 'Storage limit must be at least 100 MB'),
})

type GeneralSettingsForm = z.infer<typeof generalSettingsSchema>

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
  { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
  { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
  { value: 'Europe/London', label: 'GMT (London)' },
  { value: 'Europe/Paris', label: 'CET (Paris)' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
  { value: 'Asia/Kolkata', label: 'IST (India)' },
  { value: 'Australia/Sydney', label: 'AEST (Sydney)' },
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
]

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CAD', label: 'Canadian Dollar (CA$)' },
  { value: 'AUD', label: 'Australian Dollar (AU$)' },
  { value: 'CHF', label: 'Swiss Franc (CHF)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
]

function GeneralSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<GeneralSettingsForm>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      name: '',
      domain: '',
      description: '',
      timezone: 'UTC',
      language: 'en',
      date_format: 'Y-m-d',
      time_format: 'H:i',
      currency: 'USD',
      max_users: 1000,
      max_courses: 100,
      storage_limit: 10240,
    },
  })

  // Load data from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getGeneralSettings()
        const tenantData = response.data.tenant

        setValue('name', tenantData.name || '')
        setValue('domain', tenantData.domain || '')
        setValue('description', tenantData.description || '')
        setValue('timezone', tenantData.timezone || 'UTC')
        setValue('language', tenantData.language || 'en')
        setValue('date_format', tenantData.date_format || 'Y-m-d')
        setValue('time_format', tenantData.time_format || 'H:i')
        setValue('currency', tenantData.currency || 'USD')
        setValue('max_users', tenantData.max_users || 1000)
        setValue('max_courses', tenantData.max_courses || 100)
        setValue('storage_limit', tenantData.storage_limit || 10240)

        setIsLoadingData(false)
      } catch (_error) {
        toast.error('Failed to load settings')
        setIsLoadingData(false)
      }
    }

    loadSettings()
  }, [setValue])

  const onSubmit = async (data: GeneralSettingsForm) => {
    setIsLoading(true)
    try {
      await updateGeneralSettings(data)
      toast.success('General settings updated successfully!')
    } catch (_error) {
      toast.error('Failed to update general settings')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-6xl space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>General Settings</h1>
              <p className='text-muted-foreground'>
                Configure basic tenant information and limits
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
            <h1 className='text-2xl font-bold'>General Settings</h1>
            <p className='text-muted-foreground'>
              Configure basic tenant information and limits
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Basic tenant information and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Tenant Name</Label>
                  <Input
                    id='name'
                    {...register('name')}
                    placeholder='Enter tenant name'
                  />
                  {errors.name && (
                    <p className='text-destructive text-sm'>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='domain'>Domain</Label>
                  <Input
                    id='domain'
                    {...register('domain')}
                    placeholder='Enter domain'
                  />
                  {errors.domain && (
                    <p className='text-destructive text-sm'>
                      {errors.domain.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  {...register('description')}
                  placeholder='Enter tenant description'
                  rows={3}
                />
                {errors.description && (
                  <p className='text-destructive text-sm'>
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>
                Language, timezone, and formatting preferences
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='timezone'>Timezone</Label>
                  <Select
                    value={watch('timezone')}
                    onValueChange={(value) => setValue('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.timezone && (
                    <p className='text-destructive text-sm'>
                      {errors.timezone.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='language'>Language</Label>
                  <Select
                    value={watch('language')}
                    onValueChange={(value) => setValue('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.language && (
                    <p className='text-destructive text-sm'>
                      {errors.language.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='date_format'>Date Format</Label>
                  <Select
                    value={watch('date_format')}
                    onValueChange={(value) => setValue('date_format', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Y-m-d'>YYYY-MM-DD</SelectItem>
                      <SelectItem value='m/d/Y'>MM/DD/YYYY</SelectItem>
                      <SelectItem value='d/m/Y'>DD/MM/YYYY</SelectItem>
                      <SelectItem value='d-m-Y'>DD-MM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.date_format && (
                    <p className='text-destructive text-sm'>
                      {errors.date_format.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='time_format'>Time Format</Label>
                  <Select
                    value={watch('time_format')}
                    onValueChange={(value) => setValue('time_format', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='H:i'>24 Hour (HH:MM)</SelectItem>
                      <SelectItem value='h:i A'>
                        12 Hour (HH:MM AM/PM)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.time_format && (
                    <p className='text-destructive text-sm'>
                      {errors.time_format.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='currency'>Currency</Label>
                  <Select
                    value={watch('currency')}
                    onValueChange={(value) => setValue('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.currency && (
                    <p className='text-destructive text-sm'>
                      {errors.currency.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limits & Quotas</CardTitle>
              <CardDescription>
                Configure usage limits for your tenant
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='max_users'>Max Users</Label>
                  <Input
                    id='max_users'
                    type='number'
                    {...register('max_users', { valueAsNumber: true })}
                    placeholder='1000'
                  />
                  {errors.max_users && (
                    <p className='text-destructive text-sm'>
                      {errors.max_users.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='max_courses'>Max Courses</Label>
                  <Input
                    id='max_courses'
                    type='number'
                    {...register('max_courses', { valueAsNumber: true })}
                    placeholder='100'
                  />
                  {errors.max_courses && (
                    <p className='text-destructive text-sm'>
                      {errors.max_courses.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='storage_limit'>Storage Limit (MB)</Label>
                  <Input
                    id='storage_limit'
                    type='number'
                    {...register('storage_limit', { valueAsNumber: true })}
                    placeholder='10240'
                  />
                  {errors.storage_limit && (
                    <p className='text-destructive text-sm'>
                      {errors.storage_limit.message}
                    </p>
                  )}
                </div>
              </div>
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

export const Route = createFileRoute('/_authenticated/settings/general')({
  component: GeneralSettings,
})
