// express
import express from 'express'

// controllers
import { authController } from '../controllers/auth-controller'

// Set up router
const router = express.Router()

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
// @desc    Send email with a reset password token
// @access  Public
router.post('/send-reset-password-token', authController.sendResetPasswordToken)

// @route   PATCH api/v1/users/reset-password/:token
// @desc    Resets user password with token
// @access  Public
router.patch('/reset-password/:token', authController.resetPassword)

export const authRouter = router
