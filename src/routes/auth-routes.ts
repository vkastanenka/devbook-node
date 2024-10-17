// express
import express from 'express'
const router = express.Router()

// controllers
import {
  test,
  login,
  getSessionById,
  deleteSessionById,
} from '../controllers/auth-controller'

/////////////////
// Public Routes

// @route   GET api/v1/auth/test
// @desc    Tests auths route
// @access  Public
router.get('/test', test)

// @route   GET api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
router.post('/login', login)

/////////////////
// Private Routes

// @route   GET api/v1/auth/sessions/:id
// @desc    Returns session matching id parameter
// @access  Public
router.get('/sessions/:id', getSessionById)

// @route   DELETE api/v1/auth/sessions/:id
// @desc    Delete user session
// @access  Private
router.delete('/sessions/:id', deleteSessionById)

export const authRouter = router
