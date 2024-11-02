import { z } from 'zod'

/**
 * Inputs
 */

const searchDevbookQuerySchema = z
  .string()
  .min(3, { message: '3 characters min' })
  .max(100, { message: '100 characters max' })

/**
 * Request bodies
 */

export const searchDevbookReqBodySchema = z
  .object({
    query: searchDevbookQuerySchema,
  })
  .strict()
