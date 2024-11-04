// validation
import { z } from 'zod'
import { emailSchema } from '.'
import { userNameSchema, userUsernameSchema, userPasswordSchema } from './user'

/**
 * Request bodies
 */

export const authLoginReqBodySchema = z
  .object({
    email: emailSchema,
    password: userPasswordSchema,
  })
  .strict()

export const authRegisterReqBodySchema = z
  .object({
    id: z.string(), // temporary
    name: userNameSchema,
    email: emailSchema,
    username: userUsernameSchema,
    password: userPasswordSchema,
  })
  .strict()

export const authResetPasswordReqBodySchema = z
  .object({
    password: userPasswordSchema,
  })
  .strict()

export const authSendResetPasswordTokenReqBodySchema = z
  .object({
    email: emailSchema,
  })
  .strict()
