// express
import express from 'express'

// controllers
import { postController } from '../controllers/post-controller'

// utils
import prisma from '../lib/db'

import { protect } from '../lib/auth/protect'
import { restrict } from '../lib/auth/restrict'

// types
import { UserRole } from '@vkastanenka/devbook-prisma'

// validation
import {
  postCreateCommentReqBodySchema,
  postUpdateCommentReqBodySchema,
  postCreatePostReqBodySchema,
  postUpdatePostReqBodySchema,
  postCreatePostLikeReqBodySchema,
} from '@vkastanenka/devbook-validation/dist/post'
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

// @route   POST api/v1/posts/comment/:id
// @desc    Reads comment with args
// @access  Protected
router.post('/comment/:id', postController.postReadComment)

// @route   POST api/v1/posts/current-user/comment
// @desc    Creates current user comment
// @access  Protected
router.post(
  '/current-user/comment',
  validateCurrentUserRecordCreation,
  validateReqBody({ schema: postCreateCommentReqBodySchema }),
  postController.postCreateComment
)

// @route   PATCH api/v1/posts/current-user/comment/:id
// @desc    Updates current user comment
// @access  Protected
router.patch(
  '/current-user/comment/:id',
  validateCurrentUserRecordOwnership({ model: prisma.comment }),
  validateReqBody({ schema: postUpdateCommentReqBodySchema }),
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

// Post

// @route   POST api/v1/posts/post/:id
// @desc    Reads post with args
// @access  Protected
router.post('/post/:id', postController.postReadPost)

// @route   POST api/v1/posts/current-user/post
// @desc    Creates current user post
// @access  Protected
router.post(
  '/current-user/post',
  validateCurrentUserRecordCreation,
  validateReqBody({ schema: postCreatePostReqBodySchema }),
  postController.postCreatePost
)

// @route   PATCH api/v1/posts/current-user/post/:id
// @desc    Updates current user post
// @access  Protected
router.patch(
  '/current-user/post/:id',
  validateCurrentUserRecordOwnership({ model: prisma.post }),
  validateReqBody({ schema: postUpdatePostReqBodySchema }),
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
  validateReqBody({ schema: postCreatePostLikeReqBodySchema }),
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
