// utils
import { z } from 'zod'

// types
import { usernameSchema } from './auth'

/**
 * Request bodies
 */

export const userReadUsernameReqBodySchema = z
  .object({
    username: usernameSchema,
  })
  .strict()
