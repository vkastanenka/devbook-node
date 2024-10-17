// express
import express from 'express'
const router = express.Router()

// controllers
import { test, getSessionById } from '../controllers/auth-controller'

/////////////////
// Public Routes

// @route   GET api/v1/auth/test
// @desc    Tests auths route
// @access  Public
router.get('/test', test)

// @route   GET api/v1/auth/session/:id
// @desc    Returns session matching id parameter
// @access  Public
router.get('/session/:id', getSessionById)

export const authRouter = router
