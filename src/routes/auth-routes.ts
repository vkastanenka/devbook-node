// express
import express from 'express'

// controllers
import { authController } from '../controllers/auth-controller'

// utils
import prisma from '../lib/db'

import { protect } from '../lib/auth/protect'
import { restrict } from '../lib/auth/restrict'

// types
import { UserRole } from '@vkastanenka/devbook-prisma'

// validation
import {
  authLoginReqBodySchema,
  authRegisterReqBodySchema,
  authSendResetPasswordTokenReqBodySchema,
  authResetPasswordReqBodySchema,
  authUpdatePasswordReqBodySchema,
} from '@vkastanenka/devbook-validation/dist/auth'
import {
  validateCurrentUserRecordOwnership,
  validateReqBody,
} from '../validation'

// Set up router
const router = express.Router()

/////////////////
// Public Routes

// @route   GET api/v1/auth/test
// @desc    Tests auth route
// @access  Public
router.get('/test', authController.authTest)

// @route   POST api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
router.post(
  '/login',
  validateReqBody({
    schema: authLoginReqBodySchema,
  }),
  authController.authLogin
)

// @route   POST api/v1/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  validateReqBody({
    schema: authRegisterReqBodySchema,
  }),
  authController.authRegister
)

// @route   POST api/v1/auth/send-reset-password-token
// @desc    Send email with a reset password token
// @access  Public
router.post(
  '/send-reset-password-token',
  validateReqBody({
    schema: authSendResetPasswordTokenReqBodySchema,
  }),
  authController.authSendResetPasswordToken
)

// @route   PATCH api/v1/auth/reset-password/:token
// @desc    Resets user password with token
// @access  Public
router.patch(
  '/reset-password/:token',
  validateReqBody({
    schema: authResetPasswordReqBodySchema,
  }),
  authController.authResetPassword
)

///////////////////
// Protected Routes

router.use(protect)

// @route   GET api/v1/auth/update-password
// @desc    Updates password
// @access  Public
router.patch(
  '/update-password',
  validateReqBody({
    schema: authUpdatePasswordReqBodySchema,
  }),
  authController.authUpdatePassword
)

// @route   DELETE api/v1/auth/current-user/session/:id
// @desc    Deletes current user session
// @access  Protected
router.delete(
  '/current-user/session/:id',
  validateCurrentUserRecordOwnership({ model: prisma.session }),
  authController.authDeleteSession
)

////////////////////
// Restricted Routes

router.use(restrict([UserRole.ADMIN]))

// @route   POST api/v1/auth/session
// @desc    Creates session
// @access  Restricted
router.post('/session', authController.authCreateSession)

// @route   GET api/v1/auth/session/:id
// @desc    Returns session matching id parameter
// @access  Restricted
router.get('/session/:id', authController.authReadSession)

// @route   GET api/v1/auth/sessions
// @desc    Get all sessions
// @access  Restricted
router.get('/sessions', authController.authReadAllSessions)

// @route   PATCH api/v1/auth/session/:id
// @desc    Updates session matching id
// @access  Restricted
router.patch('/session/:id', authController.authUpdateSession)

// @route   DELETE api/v1/auth/session/:id
// @desc    Deletes session matching id
// @access  Restricted
router.delete('/session/:id', authController.authDeleteSession)

export const authRouter = router
