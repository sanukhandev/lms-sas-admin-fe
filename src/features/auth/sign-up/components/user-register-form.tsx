import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { TenantDetectionService } from '@/services/tenant-detection'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

type UserRegisterFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Please enter your name' })
      .min(2, { message: 'Name must be at least 2 characters long' }),
    email: z
      .string()
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, { message: 'Please enter your password' })
      .min(8, { message: 'Password must be at least 8 characters long' }),
    password_confirmation: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export function UserRegisterForm({
  className,
  ...props
}: UserRegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      clearError()


      // Prefer tenant domain from localStorage, fallback to URL
      let tenantDomain = undefined;
      const storedTenant = TenantDetectionService.getCurrentTenant?.();
      if (storedTenant && storedTenant.domain) {
        tenantDomain = storedTenant.domain;
      } else {
        tenantDomain = TenantDetectionService.getTenantDomainFromUrl();
      }

      await register({
        ...data,
        tenant_domain: tenantDomain,
      })

      toast.success('Registration successful!')
      navigate({ to: '/home' })
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message || 'Registration failed'
      toast.error(errorMessage)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password_confirmation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className='mt-2 text-sm text-red-500'>{error}</div>}

        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>

        <div className='text-center text-sm'>
          Already have an account?{' '}
          <Link to='/sign-in' className='text-primary hover:underline'>
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  )
}
