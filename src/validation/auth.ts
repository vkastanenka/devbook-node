// utils
import { z } from 'zod'

/**
 * Inputs
 */

export const emailSchema = z
  .string()
  .email()
  .max(100, { message: '100 characters max' })

export const passwordSchema = z
  .string()
  .min(8, { message: '8 characters min' })
  .max(100, { message: '100 characters max' })

export const nameSchema = z
  .string()
  .min(3, { message: '3 characters min' })
  .max(100, { message: '100 characters max' })
  .refine((s) => {
    const names = s.split(' ')
    if (names.length === 2) return true
  }, 'First and last names are required.')

export const usernameSchema = z
  .string()
  .min(4, { message: '4 characters min' })
  .max(15, { message: '15 characters max' })

/**
 * Request bodies
 */

export const authLoginReqBodySchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict()

export const authRegisterReqBodySchema = z
  .object({
    id: z.string(), // temporary
    name: nameSchema,
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
  })
  .strict()

export const authResetPasswordReqBodySchema = z
  .object({
    password: passwordSchema,
  })
  .strict()

export const authSendResetPasswordTokenReqBodySchema = z
  .object({
    email: emailSchema,
  })
  .strict()
