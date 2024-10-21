import { z } from 'zod'

const nameSchema = z.string().refine((s) => {
  const names = s.split(' ')
  if (names.length === 2) return true
}, 'First and last names are required.')

const emailSchema = z.string().email()

const usernameSchema = z
  .string()
  .min(4, { message: 'Username must be at least 4 characters.' })

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters.' })

export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict()

export const registrationSchema = z
  .object({
    id: z.string(), // temporary
    name: nameSchema,
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
  })
  .strict()

export const sendResetPasswordTokenSchema = z
  .object({
    email: emailSchema,
  })
  .strict()

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
  })
  .strict()
