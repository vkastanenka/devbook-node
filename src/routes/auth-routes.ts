// express
import express from 'express'
const router = express.Router()

// controllers
import { authController } from '../controllers/auth-controller'

/////////////////
// Public Routes

// @route   GET api/v1/auth/test
// @desc    Tests auths route
// @access  Public
router.get('/test', authController.test)

// @route   POST api/v1/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register)

// @route   GET api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
router.post('/login', authController.login)

/////////////////
// Private Routes

// @route   GET api/v1/auth/sessions/:id
// @desc    Returns session matching id parameter
// @access  Public
router.get('/sessions/:id', authController.getSessionById)

// @route   DELETE api/v1/auth/sessions/:id
// @desc    Delete user session
// @access  Private
router.delete('/sessions/:id', authController.deleteSessionById)

export const authRouter = router
