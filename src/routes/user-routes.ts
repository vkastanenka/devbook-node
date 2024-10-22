// express
import express from 'express'

// controllers
import { authController } from '../controllers/auth-controller'
import { userController } from '../controllers/user-controller'

// types
import { UserRole } from '@prisma/client'

// Set up router
const router = express.Router()

/////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', userController.test)

// @route   GET api/v1/users/user/:id
// @desc    Returns user matching id parameter
// @access  Public
router.get('/user/:id', userController.getUser)

// @route   GET api/v1/users/user
// @desc    Get all users
// @access  Public
router.get('/user', userController.getAllUsers)

// @route   POST api/v1/users/user
// @desc    Creates user
// @access  Public
router.post('/user', userController.postUser)

// @route   PATCH api/v1/users/user/:id
// @desc    Updates user matching id
// @access  Public
router.patch('/user/:id', userController.updateUser)

// @route   DELETE api/v1/users/user/:id
// @desc    Deletes user matching id
// @access  Public
router.delete('/user/:id', userController.deleteUser)

///////////////////
// Protected Routes

router.use(authController.protect)

// @route   GET api/v1/users/current-user
// @desc    Returns user associated with JWT
// @access  Protected
router.get('/current-user', userController.getCurrentUser)

////////////////////
// Restricted Routes

router.use(authController.restrictTo([UserRole.ADMIN]))

export const userRouter = router
