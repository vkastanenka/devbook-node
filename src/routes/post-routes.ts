// express
import express from 'express'

// controllers
import { postController } from '../controllers/post-controller'

// utils
import prisma from '../lib/db'

import { protect } from '../lib/auth/protect'
import { restrict } from '../lib/auth/restrict'

// types
import { UserRole } from '@prisma/client'

// validation
import { postValidation } from '../validation/post'
import {
  validateCurrentUserRecordCreation,
  validateCurrentUserRecordOwnership,
  validateReqBody,
} from '../validation'

// Set up router
const router = express.Router()

/////////////////
// Public Routes

// @route   GET api/v1/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', postController.postTest)

///////////////////
// Protected Routes

router.use(protect)

// Comment

// @route   POST api/v1/posts/current-user/comment
// @desc    Creates current user comment
// @access  Protected
router.post(
  '/current-user/comment',
  validateCurrentUserRecordCreation,
  validateReqBody({ schema: postValidation.postCreateCommentReqBodySchema }),
  postController.postCreateComment
)

// @route   PATCH api/v1/posts/current-user/comment/:id
// @desc    Updates current user comment
// @access  Protected
router.patch(
  '/current-user/comment/:id',
  validateCurrentUserRecordOwnership({ model: prisma.comment }),
  validateReqBody({ schema: postValidation.postUpdateCommentReqBodySchema }),
  postController.postUpdateComment
)

// @route   DELETE api/v1/posts/current-user/comment/:id
// @desc    Deletes current user comment
// @access  Protected
router.delete(
  '/current-user/comment/:id',
  validateCurrentUserRecordOwnership({ model: prisma.comment }),
  postController.postDeleteComment
)

// CommentLike

// @route   POST api/v1/posts/current-user/comment-like
// @desc    Creates current user comment like
// @access  Protected
router.post(
  '/current-user/comment-like',
  validateCurrentUserRecordCreation,
  validateReqBody({
    schema: postValidation.postCreateCommentLikeReqBodySchema,
  }),
  postController.postCreateCommentLike
)

// @route   DELETE api/v1/posts/current-user/comment-like/:id
// @desc    Deletes current user comment like
// @access  Protected
router.delete(
  '/current-user/comment-like/:id',
  validateCurrentUserRecordOwnership({ model: prisma.commentLike }),
  postController.postDeleteCommentLike
)

// Post

// @route   POST api/v1/posts/current-user/post
// @desc    Creates current user post
// @access  Protected
router.post(
  '/current-user/post',
  validateCurrentUserRecordCreation,
  validateReqBody({ schema: postValidation.postCreatePostReqBodySchema }),
  postController.postCreatePost
)

// @route   PATCH api/v1/posts/current-user/post/:id
// @desc    Updates current user post
// @access  Protected
router.patch(
  '/current-user/post/:id',
  validateCurrentUserRecordOwnership({ model: prisma.post }),
  validateReqBody({ schema: postValidation.postUpdatePostReqBodySchema }),
  postController.postUpdatePost
)

// @route   DELETE api/v1/posts/current-user/post/:id
// @desc    Deletes current user post
// @access  Protected
router.delete(
  '/current-user/post/:id',
  validateCurrentUserRecordOwnership({ model: prisma.post }),
  postController.postDeletePost
)

// PostLike

// @route   POST api/v1/posts/current-user/post-like
// @desc    Creates current user post like
// @access  Protected
router.post(
  '/current-user/post-like',
  validateCurrentUserRecordCreation,
  validateReqBody({ schema: postValidation.postCreatePostLikeReqBodySchema }),
  postController.postCreatePostLike
)

// @route   DELETE api/v1/posts/current-user/post-like/:id
// @desc    Deletes current user post like
// @access  Protected
router.delete(
  '/current-user/post-like/:id',
  validateCurrentUserRecordOwnership({ model: prisma.postLike }),
  postController.postDeletePostLike
)

////////////////////
// Restricted Routes

router.use(restrict([UserRole.ADMIN]))

// Comment

// @route   POST api/v1/posts/comment
// @desc    Creates comment
// @access  Restricted
router.post('/comment', postController.postCreateComment)

// @route   GET api/v1/posts/comment/:id
// @desc    Returns comment matching id parameter
// @access  Restricted
router.get('/comment/:id', postController.postReadComment)

// @route   GET api/v1/posts/comments
// @desc    Get all comments
// @access  Restricted
router.get('/comments', postController.postReadAllComments)

// @route   PATCH api/v1/posts/comment/:id
// @desc    Updates comment matching id
// @access  Restricted
router.patch('/comment/:id', postController.postUpdateComment)

// @route   DELETE api/v1/posts/comment/:id
// @desc    Deletes comment matching id
// @access  Restricted
router.delete('/comment/:id', postController.postDeleteComment)

// CommentLike

// @route   POST api/v1/posts/comment-like
// @desc    Creates comment like
// @access  Restricted
router.post('/comment-like', postController.postCreateCommentLike)

// @route   GET api/v1/posts/comment-like/:id
// @desc    Returns comment like matching id parameter
// @access  Restricted
router.get('/comment-like/:id', postController.postReadCommentLike)

// @route   GET api/v1/posts/comment-likes
// @desc    Get all comment likes
// @access  Restricted
router.get('/comment-likes', postController.postReadAllCommentLikes)

// @route   PATCH api/v1/posts/comment-like/:id
// @desc    Updates comment like matching id
// @access  Restricted
router.patch('/comment-like/:id', postController.postUpdateCommentLike)

// @route   DELETE api/v1/posts/comment-like/:id
// @desc    Deletes comment like matching id
// @access  Restricted
router.delete('/comment-like/:id', postController.postDeleteCommentLike)

// Post

// @route   POST api/v1/posts/post
// @desc    Creates post
// @access  Restricted
router.post('/post', postController.postCreatePost)

// @route   GET api/v1/posts/post/:id
// @desc    Returns post matching id parameter
// @access  Restricted
router.get('/post/:id', postController.postReadPost)

// @route   GET api/v1/posts/posts
// @desc    Get all posts
// @access  Restricted
router.get('/posts', postController.postReadAllPosts)

// @route   PATCH api/v1/posts/post/:id
// @desc    Updates post matching id
// @access  Restricted
router.patch('/post/:id', postController.postUpdatePost)

// @route   DELETE api/v1/posts/post/:id
// @desc    Deletes post matching id
// @access  Restricted
router.delete('/post/:id', postController.postDeletePost)

// PostLike

// @route   POST api/v1/posts/post-like
// @desc    Creates post like
// @access  Restricted
router.post('/post-like', postController.postCreatePostLike)

// @route   GET api/v1/posts/post-like/:id
// @desc    Returns post like matching id parameter
// @access  Restricted
router.get('/post-like/:id', postController.postReadPostLike)

// @route   GET api/v1/posts/post-likes
// @desc    Get all post likes
// @access  Restricted
router.get('/post-likes', postController.postReadAllPostLikes)

// @route   PATCH api/v1/posts/post-like/:id
// @desc    Updates post like matching id
// @access  Restricted
router.patch('/post-like/:id', postController.postUpdatePostLike)

// @route   DELETE api/v1/posts/post-like/:id
// @desc    Deletes post like matching id
// @access  Restricted
router.delete('/post-like/:id', postController.postDeletePostLike)

export const postRouter = router
