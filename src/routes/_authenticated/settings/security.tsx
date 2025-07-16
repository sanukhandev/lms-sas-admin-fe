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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const securitySettingsSchema = z.object({
  two_factor_auth: z.boolean(),
  password_policy: z.object({
    min_length: z.number().min(6).max(128),
    require_uppercase: z.boolean(),
    require_lowercase: z.boolean(),
    require_numbers: z.boolean(),
    require_symbols: z.boolean(),
    password_history: z.number().min(0).max(24),
    password_expiry: z.number().min(0).max(365),
  }),
  session_timeout: z.number().min(5).max(480),
  max_login_attempts: z.number().min(3).max(10),
  lockout_duration: z.number().min(5).max(60),
  ip_whitelist: z.array(z.string()).optional(),
  allowed_domains: z.array(z.string()).optional(),
  force_ssl: z.boolean(),
  content_security_policy: z.boolean(),
  data_retention_days: z.number().min(30).max(2555),
  audit_logging: z.boolean(),
  backup_encryption: z.boolean(),
})

type SecuritySettingsForm = z.infer<typeof securitySettingsSchema>

function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [ipWhitelist, setIpWhitelist] = useState<string[]>([])
  const [allowedDomains, setAllowedDomains] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SecuritySettingsForm>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      two_factor_auth: false,
      password_policy: {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: false,
        password_history: 5,
        password_expiry: 90,
      },
      session_timeout: 30,
      max_login_attempts: 5,
      lockout_duration: 15,
      ip_whitelist: [],
      allowed_domains: [],
      force_ssl: true,
      content_security_policy: true,
      data_retention_days: 365,
      audit_logging: true,
      backup_encryption: true,
    },
  })

  // Mock data loading - replace with actual API call
  useState(() => {
    setTimeout(() => {
      setValue('two_factor_auth', false)
      setValue('password_policy', {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: false,
        password_history: 5,
        password_expiry: 90,
      })
      setValue('session_timeout', 30)
      setValue('max_login_attempts', 5)
      setValue('lockout_duration', 15)
      setValue('force_ssl', true)
      setValue('content_security_policy', true)
      setValue('data_retention_days', 365)
      setValue('audit_logging', true)
      setValue('backup_encryption', true)
      setIsLoadingData(false)
    }, 1000)
  })

  const onSubmit = async (_data: SecuritySettingsForm) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Security settings updated successfully!')
    } catch (_error) {
      toast.error('Failed to update security settings')
    } finally {
      setIsLoading(false)
    }
  }

  const addIpAddress = () => {
    const newIp = (
      document.getElementById('new-ip') as HTMLInputElement
    )?.value.trim()
    if (newIp && !ipWhitelist.includes(newIp)) {
      const updated = [...ipWhitelist, newIp]
      setIpWhitelist(updated)
      setValue('ip_whitelist', updated)
      ;(document.getElementById('new-ip') as HTMLInputElement).value = ''
    }
  }

  const removeIpAddress = (ip: string) => {
    const updated = ipWhitelist.filter((item) => item !== ip)
    setIpWhitelist(updated)
    setValue('ip_whitelist', updated)
  }

  const addDomain = () => {
    const newDomain = (
      document.getElementById('new-domain') as HTMLInputElement
    )?.value.trim()
    if (newDomain && !allowedDomains.includes(newDomain)) {
      const updated = [...allowedDomains, newDomain]
      setAllowedDomains(updated)
      setValue('allowed_domains', updated)
      ;(document.getElementById('new-domain') as HTMLInputElement).value = ''
    }
  }

  const removeDomain = (domain: string) => {
    const updated = allowedDomains.filter((item) => item !== domain)
    setAllowedDomains(updated)
    setValue('allowed_domains', updated)
  }

  if (isLoadingData) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Security Settings</h1>
            <p className='text-muted-foreground'>
              Configure security policies and access controls
            </p>
          </div>
        </div>
        <div className='grid gap-6'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className='bg-muted h-6 w-48 animate-pulse rounded' />
                <div className='bg-muted h-4 w-96 animate-pulse rounded' />
              </CardHeader>
              <CardContent className='space-y-4'>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className='space-y-2'>
                    <div className='bg-muted h-4 w-24 animate-pulse rounded' />
                    <div className='bg-muted h-10 w-full animate-pulse rounded' />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Security Settings</h1>
          <p className='text-muted-foreground'>
            Configure security policies and access controls
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Configure user authentication and security policies
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label htmlFor='two_factor_auth'>
                  Two-Factor Authentication
                </Label>
                <p className='text-muted-foreground text-sm'>
                  Require users to use 2FA for enhanced security
                </p>
              </div>
              <Switch
                id='two_factor_auth'
                checked={watch('two_factor_auth')}
                onCheckedChange={(checked) =>
                  setValue('two_factor_auth', checked)
                }
              />
            </div>

            <Separator />

            <div className='space-y-4'>
              <Label>Password Policy</Label>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='min_length'>Minimum Length</Label>
                  <Input
                    id='min_length'
                    type='number'
                    min={6}
                    max={128}
                    {...register('password_policy.min_length', {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.password_policy?.min_length && (
                    <p className='text-destructive text-sm'>
                      {errors.password_policy.min_length.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='password_history'>Password History</Label>
                  <Input
                    id='password_history'
                    type='number'
                    min={0}
                    max={24}
                    {...register('password_policy.password_history', {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.password_policy?.password_history && (
                    <p className='text-destructive text-sm'>
                      {errors.password_policy.password_history.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='password_expiry'>
                    Password Expiry (days)
                  </Label>
                  <Input
                    id='password_expiry'
                    type='number'
                    min={0}
                    max={365}
                    {...register('password_policy.password_expiry', {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.password_policy?.password_expiry && (
                    <p className='text-destructive text-sm'>
                      {errors.password_policy.password_expiry.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Password Requirements</Label>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='require_uppercase'
                      checked={watch('password_policy.require_uppercase')}
                      onCheckedChange={(checked) =>
                        setValue('password_policy.require_uppercase', checked)
                      }
                    />
                    <Label htmlFor='require_uppercase'>Uppercase letters</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='require_lowercase'
                      checked={watch('password_policy.require_lowercase')}
                      onCheckedChange={(checked) =>
                        setValue('password_policy.require_lowercase', checked)
                      }
                    />
                    <Label htmlFor='require_lowercase'>Lowercase letters</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='require_numbers'
                      checked={watch('password_policy.require_numbers')}
                      onCheckedChange={(checked) =>
                        setValue('password_policy.require_numbers', checked)
                      }
                    />
                    <Label htmlFor='require_numbers'>Numbers</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='require_symbols'
                      checked={watch('password_policy.require_symbols')}
                      onCheckedChange={(checked) =>
                        setValue('password_policy.require_symbols', checked)
                      }
                    />
                    <Label htmlFor='require_symbols'>Special characters</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session & Access Control</CardTitle>
            <CardDescription>
              Configure session timeouts and access restrictions
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='session_timeout'>
                  Session Timeout (minutes)
                </Label>
                <Input
                  id='session_timeout'
                  type='number'
                  min={5}
                  max={480}
                  {...register('session_timeout', { valueAsNumber: true })}
                />
                {errors.session_timeout && (
                  <p className='text-destructive text-sm'>
                    {errors.session_timeout.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='max_login_attempts'>Max Login Attempts</Label>
                <Input
                  id='max_login_attempts'
                  type='number'
                  min={3}
                  max={10}
                  {...register('max_login_attempts', { valueAsNumber: true })}
                />
                {errors.max_login_attempts && (
                  <p className='text-destructive text-sm'>
                    {errors.max_login_attempts.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lockout_duration'>
                  Lockout Duration (minutes)
                </Label>
                <Input
                  id='lockout_duration'
                  type='number'
                  min={5}
                  max={60}
                  {...register('lockout_duration', { valueAsNumber: true })}
                />
                {errors.lockout_duration && (
                  <p className='text-destructive text-sm'>
                    {errors.lockout_duration.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>IP Whitelist</Label>
                <p className='text-muted-foreground text-sm'>
                  Restrict access to specific IP addresses (leave empty to allow
                  all)
                </p>
                <div className='flex gap-2'>
                  <Input
                    id='new-ip'
                    placeholder='Enter IP address (e.g., 192.168.1.1)'
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addIpAddress())
                    }
                  />
                  <Button type='button' onClick={addIpAddress}>
                    Add
                  </Button>
                </div>
                {ipWhitelist.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {ipWhitelist.map((ip) => (
                      <Badge
                        key={ip}
                        variant='secondary'
                        className='cursor-pointer'
                      >
                        {ip}
                        <button
                          type='button'
                          onClick={() => removeIpAddress(ip)}
                          className='ml-1 text-xs'
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className='space-y-2'>
                <Label>Allowed Email Domains</Label>
                <p className='text-muted-foreground text-sm'>
                  Restrict registration to specific email domains (leave empty
                  to allow all)
                </p>
                <div className='flex gap-2'>
                  <Input
                    id='new-domain'
                    placeholder='Enter domain (e.g., company.com)'
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addDomain())
                    }
                  />
                  <Button type='button' onClick={addDomain}>
                    Add
                  </Button>
                </div>
                {allowedDomains.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {allowedDomains.map((domain) => (
                      <Badge
                        key={domain}
                        variant='secondary'
                        className='cursor-pointer'
                      >
                        {domain}
                        <button
                          type='button'
                          onClick={() => removeDomain(domain)}
                          className='ml-1 text-xs'
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Policies</CardTitle>
            <CardDescription>
              Configure security policies and compliance settings
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='force_ssl'>Force SSL/HTTPS</Label>
                  <p className='text-muted-foreground text-sm'>
                    Require all connections to use HTTPS
                  </p>
                </div>
                <Switch
                  id='force_ssl'
                  checked={watch('force_ssl')}
                  onCheckedChange={(checked) => setValue('force_ssl', checked)}
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='content_security_policy'>
                    Content Security Policy
                  </Label>
                  <p className='text-muted-foreground text-sm'>
                    Enable CSP headers for XSS protection
                  </p>
                </div>
                <Switch
                  id='content_security_policy'
                  checked={watch('content_security_policy')}
                  onCheckedChange={(checked) =>
                    setValue('content_security_policy', checked)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='audit_logging'>Audit Logging</Label>
                  <p className='text-muted-foreground text-sm'>
                    Log security events and user activities
                  </p>
                </div>
                <Switch
                  id='audit_logging'
                  checked={watch('audit_logging')}
                  onCheckedChange={(checked) =>
                    setValue('audit_logging', checked)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='backup_encryption'>Backup Encryption</Label>
                  <p className='text-muted-foreground text-sm'>
                    Encrypt backup files and data exports
                  </p>
                </div>
                <Switch
                  id='backup_encryption'
                  checked={watch('backup_encryption')}
                  onCheckedChange={(checked) =>
                    setValue('backup_encryption', checked)
                  }
                />
              </div>
            </div>

            <Separator />

            <div className='space-y-2'>
              <Label htmlFor='data_retention_days'>Data Retention (days)</Label>
              <Input
                id='data_retention_days'
                type='number'
                min={30}
                max={2555}
                {...register('data_retention_days', { valueAsNumber: true })}
              />
              <p className='text-muted-foreground text-sm'>
                How long to retain user data and logs before automatic deletion
              </p>
              {errors.data_retention_days && (
                <p className='text-destructive text-sm'>
                  {errors.data_retention_days.message}
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

export const Route = createFileRoute('/_authenticated/settings/security')({
  component: SecuritySettings,
})
