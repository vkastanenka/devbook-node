// utils
import prisma from '../lib/db'

import { AppResponse } from '../lib/utils/app-response'
import { catchAsync } from '../lib/error/catch-async'
import { controllerFactory } from '../lib/utils/controller-factory'

// types
import { HttpStatusCode } from '../types/http-status-code'
import { Request, Response, NextFunction } from 'express'

// validation
import {
  postCreateCurrentUserCommentReqBodySchema,
  postUpdateCurrentUserCommentReqBodySchema,
  postCreateCurrentUserCommentLikeReqBodySchema,
  postCreateCurrentUserPostReqBodySchema,
  postUpdateCurrentUserPostReqBodySchema,
  postCreateCurrentUserPostLikeReqBodySchema,
} from '../validation/post'

// Tests posts route
const postTest = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Posts route secured' })
  return
}

// Create a comment connected to the current user and related post
const postCreateCurrentUserComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Add current user id to request body
    req.body.userId = req.currentUser?.id

    // Validate body
    postCreateCurrentUserCommentReqBodySchema.parse(req.body)

    // Create comment
    const comment = await prisma.comment.create({ data: req.body })

    // Respond
    new AppResponse({
      data: comment,
      message: 'Created comment!',
      res,
      statusCode: HttpStatusCode.CREATED,
    }).respond()
    return
  }
)

// Update a comment connected to the current user
const postUpdateCurrentUserComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate body
    postUpdateCurrentUserCommentReqBodySchema.parse(req.body)

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    })

    // Respond
    new AppResponse({
      data: updatedComment,
      message: 'Updated comment!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

// Delete a comment connected to the current user
const postDeleteCurrentUserComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Delete comment
    await prisma.comment.delete({
      where: {
        id: req.params.id,
        userId: req.currentUser?.id,
      },
    })

    // Respond
    new AppResponse({
      message: 'Deleted comment!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

// Create a comment like connected to the current user and related comment
const postCreateCurrentUserCommentLike = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Add current user id to request body
    req.body.userId = req.currentUser?.id

    // Validate body
    postCreateCurrentUserCommentLikeReqBodySchema.parse(req.body)

    // Create comment like
    const commentLike = await prisma.commentLike.create({ data: req.body })

    // Respond
    new AppResponse({
      data: commentLike,
      message: 'Created comment like!',
      res,
      statusCode: HttpStatusCode.CREATED,
    }).respond()
    return
  }
)

// Delete a comment like connected to the current user and related comment
const postDeleteCurrentUserCommentLike = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Delete comment like
    await prisma.commentLike.delete({
      where: {
        id: req.params.id,
        userId: req.currentUser?.id,
      },
    })

    // Respond
    new AppResponse({
      message: 'Deleted comment like!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

// Create a post connected to the current user
const postCreateCurrentUserPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Add current user id to request body
    req.body.userId = req.currentUser?.id

    // Validate body
    postCreateCurrentUserPostReqBodySchema.parse(req.body)

    // Create post
    const post = await prisma.post.create({ data: req.body })

    // Respond
    new AppResponse({
      data: post,
      message: 'Created post!',
      res,
      statusCode: HttpStatusCode.CREATED,
    }).respond()
    return
  }
)

// Update a post connected to the current user
const postUpdateCurrentUserPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate body
    postUpdateCurrentUserPostReqBodySchema.parse(req.body)

    // Create post
    const updatedPost = await prisma.post.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    })

    // Respond
    new AppResponse({
      data: updatedPost,
      message: 'Updated post!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

// Delete a post connected to the current user
const postDeleteCurrentUserPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Delete post
    await prisma.post.delete({
      where: {
        id: req.params.id,
        userId: req.currentUser?.id,
      },
    })

    // Respond
    new AppResponse({
      message: 'Deleted post!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

// Create a post like connected to the current user and related post
const postCreateCurrentUserPostLike = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Add current user id to request body
    req.body.userId = req.currentUser?.id

    // Validate body
    postCreateCurrentUserPostLikeReqBodySchema.parse(req.body)

    // Find username
    const postLike = await prisma.postLike.create({ data: req.body })

    // Respond
    new AppResponse({
      data: postLike,
      message: 'Created post like!',
      res,
      statusCode: HttpStatusCode.CREATED,
    }).respond()
    return
  }
)

// Delete a post like connected to the current user and related post
const postDeleteCurrentUserPostLike = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Delete post like
    await prisma.postLike.delete({
      where: {
        id: req.params.id,
        userId: req.currentUser?.id,
      },
    })

    // Respond
    new AppResponse({
      message: 'Deleted post like!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

// Read comment
const postReadComment = controllerFactory.readRecord(prisma.comment)

// Read all comments
const postReadAllComments = controllerFactory.readAllRecords(prisma.comment)

// Create comment
const postCreateComment = controllerFactory.createRecord(prisma.comment)

// Update comment
const postUpdateComment = controllerFactory.updateRecord(prisma.comment)

// Delete comment
const postDeleteComment = controllerFactory.deleteRecord(prisma.comment)

// Read comment like
const postReadCommentLike = controllerFactory.readRecord(prisma.commentLike)

// Read all comment likes
const postReadAllCommentLikes = controllerFactory.readAllRecords(
  prisma.commentLike
)

// Create comment like
const postCreateCommentLike = controllerFactory.createRecord(prisma.commentLike)

// Update comment like
const postUpdateCommentLike = controllerFactory.updateRecord(prisma.commentLike)

// Delete comment like
const postDeleteCommentLike = controllerFactory.deleteRecord(prisma.commentLike)

// Read post
const postReadPost = controllerFactory.readRecord(prisma.post)

// Read all posts
const postReadAllPosts = controllerFactory.readAllRecords(prisma.post)

// Create post
const postCreatePost = controllerFactory.createRecord(prisma.post)

// Update post
const postUpdatePost = controllerFactory.updateRecord(prisma.post)

// Delete post
const postDeletePost = controllerFactory.deleteRecord(prisma.post)

// Read post like
const postReadPostLike = controllerFactory.readRecord(prisma.postLike)

// Read all post likes
const postReadAllPostLikes = controllerFactory.readAllRecords(prisma.postLike)

// Create post like
const postCreatePostLike = controllerFactory.createRecord(prisma.postLike)

// Update post like
const postUpdatePostLike = controllerFactory.updateRecord(prisma.postLike)

// Delete post like
const postDeletePostLike = controllerFactory.deleteRecord(prisma.postLike)

export const postController = {
  postTest,
  postCreateCurrentUserComment,
  postUpdateCurrentUserComment,
  postDeleteCurrentUserComment,
  postCreateCurrentUserCommentLike,
  postDeleteCurrentUserCommentLike,
  postCreateCurrentUserPost,
  postUpdateCurrentUserPost,
  postDeleteCurrentUserPost,
  postCreateCurrentUserPostLike,
  postDeleteCurrentUserPostLike,
  postCreateComment,
  postReadComment,
  postReadAllComments,
  postUpdateComment,
  postDeleteComment,
  postReadCommentLike,
  postReadAllCommentLikes,
  postCreateCommentLike,
  postUpdateCommentLike,
  postDeleteCommentLike,
  postCreatePost,
  postReadPost,
  postReadAllPosts,
  postUpdatePost,
  postDeletePost,
  postReadPostLike,
  postReadAllPostLikes,
  postCreatePostLike,
  postUpdatePostLike,
  postDeletePostLike,
}
