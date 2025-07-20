import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
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
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

type SignUpFormProps = HTMLAttributes<HTMLFormElement>

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
      .min(1, {
        message: 'Please enter your password',
      })
      .min(8, {
        message: 'Password must be at least 8 characters long',
      }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match.",
    path: ['password_confirmation'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
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
      await register({ ...data, tenant_domain: 'default' })
      toast.success('Registration successful!')
      navigate({ to: '/home' })
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed')
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
        
        {error && (
          <div className='text-sm text-red-500 mt-2'>
            {error}
          </div>
        )}

        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        <div className='text-center text-sm'>
          Already have an account?{' '}
          <Link
            to='/sign-in'
            className='text-primary hover:underline'
          >
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  )
}
