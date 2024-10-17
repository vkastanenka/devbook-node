// express
import express from 'express'
const router = express.Router()

// controllers
import { test, getUserById } from '../controllers/user-controller'

/////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', test)

// @route   GET api/v1/users/:id
// @desc    Returns user matching id parameter
// @access  Public
router.get('/:id', getUserById)

export const userRouter = router
