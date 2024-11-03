// utils
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import prisma from '../lib/db'

import { addMinutes, addDays } from 'date-fns'
import { AppError } from '../lib/error/app-error'
import { AppResponse } from '../lib/utils/app-response'
import { catchAsync } from '../lib/error/catch-async'
import { controllerFactory } from '../lib/utils/controller-factory'
import { createHash, randomBytes } from 'node:crypto'
import { sendResetPasswordTokenEmail } from '../lib/utils/email'

// types
import { HttpStatusCode } from '../types/http-status-code'
import { Request, Response, NextFunction } from 'express'

// validation
import {
  authLoginReqBodySchema,
  authRegisterReqBodySchema,
  authResetPasswordReqBodySchema,
  authSendResetPasswordTokenReqBodySchema,
} from '../validation/auth'

// Test auth route
const authTest = (req: Request, res: Response, next: NextFunction) => {
  // Respond
  new AppResponse({
    message: 'Auth route secured',
    res,
    statusCode: HttpStatusCode.OK,
  }).respond()
  return
}

// Login User / JWT Response
const authLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Prepare for potential errors
    const errors: { [key: string]: string } = {}

    // Validate body
    authLoginReqBodySchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        password: true,
        resetPasswordToken: true,
        resetPasswordTokenExpires: true,
      },
    })

    // Res with error if no user or passwords don't match
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      const errorMessage = 'Email and/or password are incorrect.'
      errors.email = errorMessage
      errors.password = errorMessage
      throw new AppError({
        errors,
        message: 'Invalid inputs!',
        statusCode: HttpStatusCode.BAD_REQUEST,
      })
    }

    // Delete previous sessions
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    })

    if (user.resetPasswordToken || user.resetPasswordTokenExpires) {
      // Delete password reset data if present
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          resetPasswordToken: null,
          resetPasswordTokenExpires: null,
        },
      })
    }

    // Create user session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: addDays(new Date(), 1),
      },
    })

    // Encode session into jwt
    const jwt = await jsonwebtoken.sign(
      { id: session.id, expires: session.expires },
      process.env.JWT_SECRET || '',
      { expiresIn: '1d' }
    )

    // Respond
    new AppResponse({
      data: { jwt },
      message: 'Login successful!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

// Register user
const authRegister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Prepare for potential errors
    const errors: { [key: string]: string } = {}

    // Validate body
    authRegisterReqBodySchema.parse(req.body)

    // Check if email is taken
    const emailCheck = await prisma.user.findUnique({
      where: { email: req.body.email },
    })

    if (emailCheck) errors.email = 'Email in use'

    // Check if username is taken
    const usernameCheck = await prisma.user.findUnique({
      where: { username: req.body.username },
    })

    if (usernameCheck) errors.username = 'Username in use'

    // If any bad request errors, send response
    if (Object.keys(errors).length) {
      throw new AppError({
        errors,
        message: `Duplicate field value(s)`,
        statusCode: HttpStatusCode.BAD_REQUEST,
      })
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: req.body,
    })

    // Respond
    new AppResponse({
      data: newUser,
      message: 'Registration successful',
      res,
      statusCode: HttpStatusCode.CREATED,
    }).respond()
    return
  }
)

// Send email with a reset password token
const authSendResetPasswordToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Prepare for potential errors
    const errors: { [key: string]: string } = {}

    // Validate body
    authSendResetPasswordTokenReqBodySchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    })

    if (!user) {
      errors.email = 'No user found with email!'
      throw new AppError({
        errors,
        message: 'User not found!',
        statusCode: HttpStatusCode.NOT_FOUND,
      })
    }

    // Create reset password token and expiration
    const token = randomBytes(32).toString('hex')
    const tokenHashed = createHash('sha256').update(token).digest('hex')
    const resetPasswordTokenExpires = addMinutes(new Date(), 10)

    // Add information to user document
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordToken: tokenHashed,
        resetPasswordTokenExpires,
      },
    })

    try {
      // Send an email with a link to a form to reset the user's password
      const resetPasswordUrl = `http://localhost:3000/reset-password/?token=${tokenHashed}`
      await sendResetPasswordTokenEmail({
        to: user.email,
        url: resetPasswordUrl,
      })

      // Respond
      new AppResponse({
        message: 'Reset password email sent!',
        res,
        statusCode: HttpStatusCode.OK,
      }).respond()
      return
    } catch (err) {
      // In case of an error, reset the fields in the user document
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          resetPasswordToken: null,
          resetPasswordTokenExpires: null,
        },
      })

      // Respond
      throw new AppError({
        message:
          'There was a problem sending the email, please try again later!',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      })
    }
  }
)

// Resets user password with token
const authResetPassword = catchAsync(async (req, res, next) => {
  // Validate body
  authResetPasswordReqBodySchema.parse(req.body)

  // Find user
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: req.params.token,
    },
    select: {
      id: true,
      resetPasswordToken: true,
      resetPasswordTokenExpires: true,
    },
  })

  // Check if user with token exists or token has expired
  if (
    !user ||
    (user?.resetPasswordTokenExpires &&
      new Date() > user?.resetPasswordTokenExpires)
  ) {
    throw new AppError({
      message: 'Token is invalid or expired.',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    })
  }

  // If token is valid and not expired, set the new password
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: req.body.password,
      resetPasswordToken: null,
      resetPasswordTokenExpires: null,
      passwordUpdatedAt: new Date(),
    },
  })

  // Respond
  new AppResponse({
    message: 'Password reset!',
    res,
    statusCode: HttpStatusCode.OK,
  }).respond()
  return
})

// Delete session
const authDeleteSession = controllerFactory.deleteRecord(prisma.session)

export const authController = {
  authTest,
  authDeleteSession,
  authRegister,
  authLogin,
  authSendResetPasswordToken,
  authResetPassword,
}
