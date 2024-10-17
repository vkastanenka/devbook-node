// express
import express from 'express'
const router = express.Router()

// controllers
import { userController } from '../controllers/user-controller'

/////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', userController.test)

// @route   GET api/v1/users/:id
// @desc    Returns user matching id parameter
// @access  Public
router.get('/:id', userController.getUser)

// @route   POST api/v1/users
// @desc    Creates user
// @access  Public
router.post('', userController.postUser)

// @route   PATCH api/v1/users/:id
// @desc    Updates user matching id
// @access  Public
router.patch('/:id', userController.updateUser)

// @route   DELETE api/v1/users/:id
// @desc    Deletes user matching id
// @access  Public
router.delete('/:id', userController.deleteUser)

export const userRouter = router
