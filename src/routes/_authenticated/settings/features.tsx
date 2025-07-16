import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const featuresSettingsSchema = z.object({
  courses: z.boolean(),
  certificates: z.boolean(),
  payments: z.boolean(),
  notifications: z.boolean(),
  messaging: z.boolean(),
  forums: z.boolean(),
  live_sessions: z.boolean(),
  mobile_app: z.boolean(),
  analytics: z.boolean(),
  api_access: z.boolean(),
  white_label: z.boolean(),
  custom_domain: z.boolean(),
  sso: z.boolean(),
  ldap: z.boolean(),
  backup: z.boolean(),
})

type FeaturesSettingsForm = z.infer<typeof featuresSettingsSchema>

interface FeatureItem {
  key: keyof FeaturesSettingsForm
  title: string
  description: string
  category: 'core' | 'advanced' | 'enterprise'
  badge?: string
}

const features: FeatureItem[] = [
  {
    key: 'courses',
    title: 'Course Management',
    description: 'Create and manage courses, lessons, and content',
    category: 'core',
  },
  {
    key: 'certificates',
    title: 'Certificates',
    description: 'Generate and manage completion certificates',
    category: 'core',
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description: 'Email and in-app notifications for users',
    category: 'core',
  },
  {
    key: 'analytics',
    title: 'Analytics & Reporting',
    description: 'Track user progress and generate reports',
    category: 'core',
  },
  {
    key: 'messaging',
    title: 'Messaging System',
    description: 'Internal messaging between users and instructors',
    category: 'advanced',
  },
  {
    key: 'forums',
    title: 'Discussion Forums',
    description: 'Course-specific discussion boards',
    category: 'advanced',
  },
  {
    key: 'live_sessions',
    title: 'Live Sessions',
    description: 'Video conferencing and webinar capabilities',
    category: 'advanced',
    badge: 'Pro',
  },
  {
    key: 'payments',
    title: 'Payment Processing',
    description: 'Accept payments for courses and subscriptions',
    category: 'advanced',
    badge: 'Pro',
  },
  {
    key: 'mobile_app',
    title: 'Mobile App',
    description: 'Native mobile application access',
    category: 'advanced',
    badge: 'Pro',
  },
  {
    key: 'api_access',
    title: 'API Access',
    description: 'REST API for third-party integrations',
    category: 'enterprise',
    badge: 'Enterprise',
  },
  {
    key: 'white_label',
    title: 'White Label',
    description: 'Remove branding and use your own',
    category: 'enterprise',
    badge: 'Enterprise',
  },
  {
    key: 'custom_domain',
    title: 'Custom Domain',
    description: 'Use your own domain name',
    category: 'enterprise',
    badge: 'Enterprise',
  },
  {
    key: 'sso',
    title: 'Single Sign-On (SSO)',
    description: 'SAML and OAuth integration',
    category: 'enterprise',
    badge: 'Enterprise',
  },
  {
    key: 'ldap',
    title: 'LDAP Integration',
    description: 'Active Directory and LDAP authentication',
    category: 'enterprise',
    badge: 'Enterprise',
  },
  {
    key: 'backup',
    title: 'Automated Backups',
    description: 'Regular data backups and recovery',
    category: 'core',
  },
]

function FeaturesSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const { handleSubmit, setValue, watch } = useForm<FeaturesSettingsForm>({
    resolver: zodResolver(featuresSettingsSchema),
    defaultValues: {
      courses: true,
      certificates: true,
      payments: false,
      notifications: true,
      messaging: true,
      forums: false,
      live_sessions: false,
      mobile_app: false,
      analytics: true,
      api_access: false,
      white_label: false,
      custom_domain: false,
      sso: false,
      ldap: false,
      backup: true,
    },
  })

  // Mock data loading - replace with actual API call
  useState(() => {
    setTimeout(() => {
      setValue('courses', true)
      setValue('certificates', true)
      setValue('payments', false)
      setValue('notifications', true)
      setValue('messaging', true)
      setValue('forums', false)
      setValue('live_sessions', false)
      setValue('mobile_app', false)
      setValue('analytics', true)
      setValue('api_access', false)
      setValue('white_label', false)
      setValue('custom_domain', false)
      setValue('sso', false)
      setValue('ldap', false)
      setValue('backup', true)
      setIsLoadingData(false)
    }, 1000)
  })

  const onSubmit = async (_data: FeaturesSettingsForm) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Features settings updated successfully!')
    } catch (_error) {
      toast.error('Failed to update features settings')
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'core':
        return 'Core Features'
      case 'advanced':
        return 'Advanced Features'
      case 'enterprise':
        return 'Enterprise Features'
      default:
        return 'Features'
    }
  }

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'Pro':
        return 'default'
      case 'Enterprise':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (isLoadingData) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Features Settings</h1>
            <p className='text-muted-foreground'>
              Configure available features for your tenant
            </p>
          </div>
        </div>
        <div className='grid gap-6'>
          {['core', 'advanced', 'enterprise'].map((category) => (
            <Card key={category}>
              <CardHeader>
                <div className='bg-muted h-6 w-48 animate-pulse rounded' />
                <div className='bg-muted h-4 w-96 animate-pulse rounded' />
              </CardHeader>
              <CardContent className='space-y-4'>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between rounded-lg border p-4'
                  >
                    <div className='space-y-2'>
                      <div className='bg-muted h-5 w-48 animate-pulse rounded' />
                      <div className='bg-muted h-4 w-72 animate-pulse rounded' />
                    </div>
                    <div className='bg-muted h-6 w-12 animate-pulse rounded' />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const groupedFeatures = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = []
      }
      acc[feature.category].push(feature)
      return acc
    },
    {} as Record<string, FeatureItem[]>
  )

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Features Settings</h1>
          <p className='text-muted-foreground'>
            Configure available features for your tenant
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {(['core', 'advanced', 'enterprise'] as const).map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{getCategoryTitle(category)}</CardTitle>
              <CardDescription>
                {category === 'core' &&
                  'Essential features available to all tenants'}
                {category === 'advanced' &&
                  'Additional features for enhanced functionality'}
                {category === 'enterprise' &&
                  'Premium features for enterprise customers'}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {groupedFeatures[category]?.map((feature) => (
                <div
                  key={feature.key}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Label
                        htmlFor={feature.key}
                        className='text-base font-medium'
                      >
                        {feature.title}
                      </Label>
                      {feature.badge && (
                        <Badge variant={getBadgeVariant(feature.badge)}>
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      {feature.description}
                    </p>
                  </div>
                  <Switch
                    id={feature.key}
                    checked={watch(feature.key)}
                    onCheckedChange={(checked) =>
                      setValue(feature.key, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <div className='flex justify-end'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/settings/features')({
  component: FeaturesSettings,
})
