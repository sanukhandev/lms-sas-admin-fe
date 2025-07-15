import { createFileRoute } from '@tanstack/react-router'
import TenantThemeDemo from '@/components/tenant-theme-demo'

export const Route = createFileRoute('/_authenticated/theme-demo-new')({
  component: TenantThemeDemo,
})
