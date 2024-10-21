// controllers
import { controllerFactory } from '../lib/controller-factory'

// utils
import prisma from '../lib/db'
import bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'
import { catchAsync } from '../lib/catch-async'
import { addMinutes, addDays } from 'date-fns'
import { sendResetPasswordTokenEmail } from '../lib/email'
import { responseService } from '../lib/response-service'

// types
import { Request, Response, NextFunction } from 'express'

// validation
import {
  loginSchema,
  registrationSchema,
  sendResetPasswordTokenSchema,
  resetPasswordSchema,
} from '../lib/validation/auth'

/////////////////
// Public Routes

// @route   GET api/v1/auth/test
// @desc    Tests auth route
// @access  Public
const test = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Auth route secured' })
}

// @route   POST api/v1/auth/register
// @desc    Register user
// @access  Public
const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate body
    registrationSchema.parse(req.body)

    // Check if email is taken
    const emailCheck = await prisma.user.findUnique({
      where: { email: req.body.email },
    })

    if (emailCheck) {
      return res
        .status(responseService.statusCodes.badRequest)
        .json(responseService.badRequestError('Email taken!'))
    }

    // Check if username is taken
    const usernameCheck = await prisma.user.findUnique({
      where: { username: req.body.username },
    })

    if (usernameCheck) {
      return res
        .status(responseService.statusCodes.badRequest)
        .json(responseService.badRequestError('Username taken!'))
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: req.body,
    })

    // Respond
    res
      .status(responseService.statusCodes.created)
      .json(responseService.createdSuccess('Registration successful!', newUser))
  }
)

// @route   POST api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate body
    loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        password: true,
      },
    })

    // Res with error if no user or passwords don't match
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res
        .status(responseService.statusCodes.badRequest)
        .json(
          responseService.badRequestError(
            'Email and/or password are incorrect.'
          )
        )
    }

    // Delete previous sessions
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    })

    // Create user session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: addDays(new Date(), 1),
      },
    })

    // Encode session into jwt
    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET)
    const jwt = await new SignJWT({ id: session.id, expires: session.expires })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(jwtSecret)

    // Respond
    res
      .status(responseService.statusCodes.ok)
      .json(responseService.success('Login successful!', jwt))
  }
)

// @route   POST api/v1/auth/send-reset-password-token
// @desc    Send email with a reset password token
// @access  Public
const sendResetPasswordToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate body
    sendResetPasswordTokenSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    })

    if (!user) {
      return res
        .status(responseService.statusCodes.notFound)
        .json(
          responseService.notFoundError('No user found with provided email!')
        )
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
      const resetPasswordUrl = `http://localhost:3000/reset-password/${tokenHashed}`
      await sendResetPasswordTokenEmail({
        to: user.email,
        url: resetPasswordUrl,
      })

      // Respond
      res
        .status(responseService.statusCodes.ok)
        .json(
          responseService.success('Reset password token send to email!', {})
        )
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
      res
        .status(responseService.statusCodes.internalServerError)
        .json(
          responseService.internalServerError(
            'There was a problem sending the email, please try again later!'
          )
        )
    }
  }
)

// @route   PATCH api/v1/users/reset-password/:token
// @desc    Resets user password with token
// @access  Public
const resetPassword = catchAsync(async (req, res, next) => {
  // Validate body
  resetPasswordSchema.parse(req.body)

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
    return res
      .status(responseService.statusCodes.badRequest)
      .json(responseService.badRequestError('Token is invalid or expired.'))
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
  res
    .status(responseService.statusCodes.ok)
    .json(responseService.success('Password successfully reset!', {}))
})

///////////////////
// Protected Routes

// @route   GET api/v1/auth/sessions/:id
// @desc    Get user session
// @access  Public
const getSession = controllerFactory.readRecord(prisma.session)

// @route   DELETE api/v1/auth/sessions/:id
// @desc    Delete user session
// @access  Private
const deleteSession = controllerFactory.deleteRecord(prisma.session)

// //////////////
// // Middleware

// // Privatizes routes and makes accessible only to users with valid jwt session token
// const protect = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const errors: { [key: string]: string } = {}

//     // Assigning token based on headers
//     let token
//     if (req.headers.authorization?.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1]
//     }

//     // Check if the token exists
//     if (!token) {
//       errors.authentication =
//         'You are not logged in! Please log in to gain access.'
//       return res.status(401).json(errors)
//     }

//     // Decode jwt session token
//     const jwtSecret = new TextEncoder().encode(process.env.NEXT_JWT_SECRET)
//     const { payload } = await jwtVerify(token, jwtSecret, {
//       algorithms: ['HS256'],
//     })
//     const decodedJwt = payload as { id: string; expires: string; iat: number }

//     // Check if session is expired
//     if (decodedJwt.expires < new Date().toString()) {
//       errors.authentication = 'Access token is expired. Please log in again.'
//       return res.status(401).json(errors)
//     }

//     // Find session with user id
//     const session = await prisma.session.findUnique({
//       where: {
//         id: decodedJwt.id,
//       },
//     })

//     // Check if the session exists
//     if (!session) {
//       errors.query = 'Error locating session. Please log in again.'
//       return res.status(400).json(errors)
//     }

//     // Find current user with session data
//     const currentUser = await prisma.user.findUnique({
//       where: {
//         id: session.userId,
//       },
//     })

//     // Check if current user still exists
//     if (!currentUser) {
//       errors.query = 'The user related to this token no longer exists.'
//       return res.status(401).json(errors)
//     }

//     // Check if user changed password after the token was issued TODO
//     // if (await currentUser.changedPasswordAfter(decoded.iat)) {
//     //   errors.changedPassword =
//     //     'User has recently changed their password! Please log in again!'
//     //   return res.status(401).json(errors)
//     // }

//     // Assign currentUser to req.user to be used in protected route functions
//     // req.user = currentUser
//     next()
//   }
// )

// const restrictTo = (roles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const errors: { [key: string]: string } = {}

//     // If the user's role is not included in the argument, deny access
//     if (req.user && !roles.includes(req.user.role)) {
//       errors.unauthorized = 'You do not have permission to perform this action.'
//       return res.status(403).json(errors)
//     }

//     next()
//   }
// }

export const authController = {
  // protect,
  // restrictTo,
  test,
  register,
  login,
  sendResetPasswordToken,
  resetPassword,
  getSession,
  deleteSession,
}
