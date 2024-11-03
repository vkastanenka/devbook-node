import { z } from 'zod'

/**
 * Inputs
 */

const commentBodySchema = z
  .string()
  .min(10, { message: 'Minimum 10 characters.' })
  .max(1000, {
    message: 'Maximum 1000 characters.',
  })

const postBodySchema = z
  .string()
  .min(10, { message: 'Minimum 10 characters.' })
  .max(1000, {
    message: 'Maximum 1000 characters.',
  })

/**
 * Request bodies
 */

export const postCreateCurrentUserCommentReqBodySchema = z
  .object({
    body: commentBodySchema,
    parentCommentId: z.string().uuid().optional(),
    postId: z.string().uuid(),
    userId: z.string().uuid(),
  })
  .strict()

export const postUpdateCurrentUserCommentReqBodySchema = z
  .object({
    body: commentBodySchema,
  })
  .strict()

export const postCreateCurrentUserCommentLikeReqBodySchema = z
  .object({
    commentId: z.string().uuid(),
    userId: z.string().uuid(),
  })
  .strict()

export const postCreateCurrentUserPostReqBodySchema = z
  .object({
    body: postBodySchema,
    userId: z.string().uuid(),
  })
  .strict()

export const postUpdateCurrentUserPostReqBodySchema = z
  .object({
    body: postBodySchema,
  })
  .strict()

export const postCreateCurrentUserPostLikeReqBodySchema = z
  .object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
  })
  .strict()
