import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
})

export const sendResetPasswordTokenSchema = z.object({
  email: z.string().email(),
})

export const registrationSchema = z.object({
  name: z.string().refine((s) => {
    const names = s.split(' ')
    if (names.length === 2) return true
  }, 'First and last names are required.'),
  email: z.string().email(),
  username: z
    .string()
    .min(4, { message: 'Username must be at least 4 characters.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
})
