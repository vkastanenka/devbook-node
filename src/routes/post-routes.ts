// express
import express from 'express'

// controllers
import { postController } from '../controllers/post-controller'

// utils
import { protect } from '../lib/auth/protect'
import { restrict } from '../lib/auth/restrict'

// types
import { UserRole } from '@prisma/client'

// Set up router
const router = express.Router()

/////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', postController.postTest)

///////////////////
// Protected Routes

router.use(protect)

////////////////////
// Restricted Routes

router.use(restrict([UserRole.ADMIN]))

// @route   GET api/v1/posts/post/:id
// @desc    Returns post matching id parameter
// @access  Public
router.get('/post/:id', postController.postReadPost)

// @route   GET api/v1/posts/posts
// @desc    Get all posts
// @access  Public
router.get('/posts', postController.postReadAllPosts)

// @route   POST api/v1/posts/post
// @desc    Creates post
// @access  Public
router.post('/post', postController.postCreatePost)

// @route   PATCH api/v1/posts/post/:id
// @desc    Updates post matching id
// @access  Public
router.patch('/post/:id', postController.postUpdatePost)

// @route   DELETE api/v1/posts/post/:id
// @desc    Deletes post matching id
// @access  Public
router.delete('/post/:id', postController.postDeletePost)

export const postRouter = router
