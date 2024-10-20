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

// @route   POST api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
router.post('/login', authController.login)

// @route   POST api/v1/auth/send-reset-password-token
// @desc    Send email with a password reset token
// @access  Public
router.post('/send-reset-password-token', authController.sendResetPasswordToken)

// @route   PATCH api/v1/users/reset-password/:token
// @desc    Resets user password with token
// @access  Public
router.patch('/reset-password/:token', authController.resetPassword)

///////////////////
// Protected Routes

// @route   GET api/v1/auth/sessions/:id
// @desc    Returns session matching id parameter
// @access  Public
router.get('/sessions/:id', authController.getSession)

// @route   DELETE api/v1/auth/sessions/:id
// @desc    Delete user session
// @access  Private
router.delete('/sessions/:id', authController.deleteSession)

export const authRouter = router
