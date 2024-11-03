// express
import express from 'express'

// controllers
import { userController } from '../controllers/user-controller'

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
router.get('/test', userController.userTest)

///////////////////
// Protected Routes

router.use(protect)

// @route   GET api/v1/users/current-user
// @desc    Returns user associated with JWT
// @access  Protected
router.get('/current-user', userController.userGetCurrentUser)

// @route   POST api/v1/users/username/:username
// @desc    Gets user with relations
// @access  Protected
router.get('/username/:username', userController.userReadUsername)

////////////////////
// Restricted Routes

router.use(restrict([UserRole.ADMIN]))

// @route   GET api/v1/users/user/:id
// @desc    Returns user matching id parameter
// @access  Public
router.get('/user/:id', userController.userReadUser)

// @route   GET api/v1/users/users
// @desc    Get all users
// @access  Public
router.get('/users', userController.userReadAllUsers)

// @route   POST api/v1/users/user
// @desc    Creates user
// @access  Public
router.post('/user', userController.userCreateUser)

// @route   PATCH api/v1/users/user/:id
// @desc    Updates user matching id
// @access  Public
router.patch('/user/:id', userController.userUpdateUser)

// @route   DELETE api/v1/users/user/:id
// @desc    Deletes user matching id
// @access  Public
router.delete('/user/:id', userController.userDeleteUser)

export const userRouter = router
