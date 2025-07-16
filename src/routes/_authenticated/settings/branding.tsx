import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
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
import { Textarea } from '@/components/ui/textarea'

const brandingSettingsSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  primary_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  secondary_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  accent_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  background_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  text_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  footer_text: z.string().optional(),
  welcome_message: z.string().optional(),
  email_signature: z.string().optional(),
})

type BrandingSettingsForm = z.infer<typeof brandingSettingsSchema>

function BrandingSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BrandingSettingsForm>({
    resolver: zodResolver(brandingSettingsSchema),
    defaultValues: {
      company_name: '',
      primary_color: '#3b82f6',
      secondary_color: '#64748b',
      accent_color: '#10b981',
      background_color: '#ffffff',
      text_color: '#1f2937',
      footer_text: '',
      welcome_message: '',
      email_signature: '',
    },
  })

  // Mock data loading - replace with actual API call
  useState(() => {
    setTimeout(() => {
      setValue('company_name', 'Acme University')
      setValue('primary_color', '#3b82f6')
      setValue('secondary_color', '#64748b')
      setValue('accent_color', '#10b981')
      setValue('background_color', '#ffffff')
      setValue('text_color', '#1f2937')
      setValue('footer_text', '© 2024 Acme University. All rights reserved.')
      setValue('welcome_message', 'Welcome to our learning platform!')
      setValue('email_signature', 'Best regards,\\nThe Acme University Team')
      setIsLoadingData(false)
    }, 1000)
  })

  const onSubmit = async (_data: BrandingSettingsForm) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Branding settings updated successfully!')
    } catch (_error) {
      toast.error('Failed to update branding settings')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Branding Settings</h1>
            <p className='text-muted-foreground'>
              Customize your tenant's appearance and branding
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
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Branding Settings</h1>
          <p className='text-muted-foreground'>
            Customize your tenant's appearance and branding
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Brand Identity</CardTitle>
            <CardDescription>
              Configure your organization's branding and identity
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='company_name'>Company Name</Label>
              <Input
                id='company_name'
                {...register('company_name')}
                placeholder='Enter company name'
              />
              {errors.company_name && (
                <p className='text-destructive text-sm'>
                  {errors.company_name.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='logo'>Logo</Label>
                <Input
                  id='logo'
                  type='file'
                  accept='image/*'
                  className='file:border-0 file:bg-transparent file:text-sm file:font-medium'
                />
                <p className='text-muted-foreground text-xs'>
                  Recommended: 200x60px, PNG or SVG format
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='favicon'>Favicon</Label>
                <Input
                  id='favicon'
                  type='file'
                  accept='image/*'
                  className='file:border-0 file:bg-transparent file:text-sm file:font-medium'
                />
                <p className='text-muted-foreground text-xs'>
                  Recommended: 32x32px, ICO or PNG format
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
            <CardDescription>
              Define your brand colors and theme
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='primary_color'>Primary Color</Label>
                <div className='flex gap-2'>
                  <Input
                    id='primary_color'
                    type='color'
                    {...register('primary_color')}
                    className='border-input h-10 w-16 rounded'
                  />
                  <Input
                    {...register('primary_color')}
                    placeholder='#3b82f6'
                    className='flex-1'
                  />
                </div>
                {errors.primary_color && (
                  <p className='text-destructive text-sm'>
                    {errors.primary_color.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='secondary_color'>Secondary Color</Label>
                <div className='flex gap-2'>
                  <Input
                    id='secondary_color'
                    type='color'
                    {...register('secondary_color')}
                    className='border-input h-10 w-16 rounded'
                  />
                  <Input
                    {...register('secondary_color')}
                    placeholder='#64748b'
                    className='flex-1'
                  />
                </div>
                {errors.secondary_color && (
                  <p className='text-destructive text-sm'>
                    {errors.secondary_color.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='accent_color'>Accent Color</Label>
                <div className='flex gap-2'>
                  <Input
                    id='accent_color'
                    type='color'
                    {...register('accent_color')}
                    className='border-input h-10 w-16 rounded'
                  />
                  <Input
                    {...register('accent_color')}
                    placeholder='#10b981'
                    className='flex-1'
                  />
                </div>
                {errors.accent_color && (
                  <p className='text-destructive text-sm'>
                    {errors.accent_color.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='background_color'>Background Color</Label>
                <div className='flex gap-2'>
                  <Input
                    id='background_color'
                    type='color'
                    {...register('background_color')}
                    className='border-input h-10 w-16 rounded'
                  />
                  <Input
                    {...register('background_color')}
                    placeholder='#ffffff'
                    className='flex-1'
                  />
                </div>
                {errors.background_color && (
                  <p className='text-destructive text-sm'>
                    {errors.background_color.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='text_color'>Text Color</Label>
                <div className='flex gap-2'>
                  <Input
                    id='text_color'
                    type='color'
                    {...register('text_color')}
                    className='border-input h-10 w-16 rounded'
                  />
                  <Input
                    {...register('text_color')}
                    placeholder='#1f2937'
                    className='flex-1'
                  />
                </div>
                {errors.text_color && (
                  <p className='text-destructive text-sm'>
                    {errors.text_color.message}
                  </p>
                )}
              </div>
            </div>

            {/* Color Preview */}
            <div
              className='rounded-lg border p-4'
              style={{ backgroundColor: watch('background_color') }}
            >
              <h3
                className='mb-2 font-semibold'
                style={{ color: watch('text_color') }}
              >
                Color Preview
              </h3>
              <div className='space-y-2'>
                <div
                  className='inline-block rounded px-3 py-1 text-sm text-white'
                  style={{ backgroundColor: watch('primary_color') }}
                >
                  Primary Button
                </div>
                <div
                  className='ml-2 inline-block rounded px-3 py-1 text-sm text-white'
                  style={{ backgroundColor: watch('secondary_color') }}
                >
                  Secondary Button
                </div>
                <div
                  className='ml-2 inline-block rounded px-3 py-1 text-sm text-white'
                  style={{ backgroundColor: watch('accent_color') }}
                >
                  Accent Button
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content & Messaging</CardTitle>
            <CardDescription>
              Customize text content and messaging
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='welcome_message'>Welcome Message</Label>
              <Textarea
                id='welcome_message'
                {...register('welcome_message')}
                placeholder='Enter welcome message for new users'
                rows={3}
              />
              {errors.welcome_message && (
                <p className='text-destructive text-sm'>
                  {errors.welcome_message.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='footer_text'>Footer Text</Label>
              <Textarea
                id='footer_text'
                {...register('footer_text')}
                placeholder='Enter footer text'
                rows={2}
              />
              {errors.footer_text && (
                <p className='text-destructive text-sm'>
                  {errors.footer_text.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email_signature'>Email Signature</Label>
              <Textarea
                id='email_signature'
                {...register('email_signature')}
                placeholder='Enter email signature'
                rows={3}
              />
              {errors.email_signature && (
                <p className='text-destructive text-sm'>
                  {errors.email_signature.message}
                </p>
              )}
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
  )
}

export const Route = createFileRoute('/_authenticated/settings/branding')({
  component: BrandingSettings,
})
