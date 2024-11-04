// utils
import prisma from '../lib/db'

import { crudFactory } from '../lib/utils/crud-factory'

// types
import { Request, Response, NextFunction } from 'express'

// Tests posts route
const postTest = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Posts route secured' })
  return
}

// Comment
const postReadComment = crudFactory.readRecord(prisma.comment)
const postReadAllComments = crudFactory.readAllRecords(prisma.comment)
const postCreateComment = crudFactory.createRecord(prisma.comment)
const postUpdateComment = crudFactory.updateRecord(prisma.comment)
const postDeleteComment = crudFactory.deleteRecord(prisma.comment)

// CommentLike
const postReadCommentLike = crudFactory.readRecord(prisma.commentLike)
const postReadAllCommentLikes = crudFactory.readAllRecords(prisma.commentLike)
const postCreateCommentLike = crudFactory.createRecord(prisma.commentLike)
const postUpdateCommentLike = crudFactory.updateRecord(prisma.commentLike)
const postDeleteCommentLike = crudFactory.deleteRecord(prisma.commentLike)

// Post
const postReadPost = crudFactory.readRecord(prisma.post)
const postReadAllPosts = crudFactory.readAllRecords(prisma.post)
const postCreatePost = crudFactory.createRecord(prisma.post)
const postUpdatePost = crudFactory.updateRecord(prisma.post)
const postDeletePost = crudFactory.deleteRecord(prisma.post)

// PostLike
const postReadPostLike = crudFactory.readRecord(prisma.postLike)
const postReadAllPostLikes = crudFactory.readAllRecords(prisma.postLike)
const postCreatePostLike = crudFactory.createRecord(prisma.postLike)
const postUpdatePostLike = crudFactory.updateRecord(prisma.postLike)
const postDeletePostLike = crudFactory.deleteRecord(prisma.postLike)

export const postController = {
  postTest,
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
