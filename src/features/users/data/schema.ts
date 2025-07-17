import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('admin'),
  z.literal('instructor'),
  z.literal('student'),
])

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: userRoleSchema,
  status: userStatusSchema,
  enrolledCourses: z.number(),
  completedCourses: z.number(),
  progressPercentage: z.number(),
  lastLogin: z.string(),
  joinedAt: z.string(),
  totalSpent: z.number(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
