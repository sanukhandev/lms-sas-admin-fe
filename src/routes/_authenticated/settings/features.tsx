import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  getFeaturesSettings,
  updateFeaturesSettings,
} from '@/services/tenant-settings'
import type { FeaturesSettings } from '@/services/tenant-settings'
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

  // Load data from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getFeaturesSettings()
        const featuresData = response.data

        setValue('courses', featuresData.courses_enabled ?? true)
        setValue('certificates', featuresData.certificates_enabled ?? true)
        setValue('payments', featuresData.payments_enabled ?? false)
        setValue('notifications', featuresData.notifications_enabled ?? true)
        setValue('messaging', featuresData.messaging_enabled ?? true)
        setValue('forums', featuresData.forums_enabled ?? false)
        setValue('live_sessions', featuresData.live_sessions_enabled ?? false)
        setValue('mobile_app', featuresData.mobile_app_enabled ?? false)
        setValue('analytics', featuresData.analytics_enabled ?? true)
        setValue('api_access', featuresData.api_access_enabled ?? false)
        setValue('white_label', featuresData.white_label_enabled ?? false)
        setValue('custom_domain', featuresData.custom_domains_enabled ?? false)
        setValue('sso', featuresData.sso_enabled ?? false)
        setValue('ldap', featuresData.ldap_enabled ?? false)
        setValue('backup', featuresData.backup_enabled ?? true)

        setIsLoadingData(false)
      } catch (_error) {
        toast.error('Failed to load features settings')
        setIsLoadingData(false)
      }
    }

    loadSettings()
  }, [setValue])

  const onSubmit = async (data: FeaturesSettingsForm) => {
    setIsLoading(true)
    try {
      // Transform the data to match the backend expected format
      const transformedData: FeaturesSettings = {
        courses_enabled: data.courses,
        assignments_enabled: true, // Default value since not in form
        quizzes_enabled: true, // Default value since not in form
        forums_enabled: data.forums,
        certificates_enabled: data.certificates,
        analytics_enabled: data.analytics,
        mobile_app_enabled: data.mobile_app,
        api_access_enabled: data.api_access,
        white_label_enabled: data.white_label,
        sso_enabled: data.sso,
        custom_domains_enabled: data.custom_domain,
        advanced_reporting_enabled: data.analytics, // Map to analytics for now
      }

      await updateFeaturesSettings(transformedData)
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
      <main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-6xl space-y-6'>
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
      </main>
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
    <main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl space-y-6'>
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
    </main>
  )
}

export const Route = createFileRoute('/_authenticated/settings/features')({
  component: FeaturesSettings,
})
