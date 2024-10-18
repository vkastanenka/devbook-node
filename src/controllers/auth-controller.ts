// utils
import prisma from '../lib/db'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { v4 as uuidv4 } from 'uuid'
import { catchAsync } from '../lib/catchAsync'

// types
import { Request, Response, NextFunction } from 'express'

// validation
import { loginSchema, registrationSchema } from '../lib/validation/auth'

//////////////
// Middleware

// Privatizes routes and makes accessible only to users with valid jwt session token
const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors: { [key: string]: string } = {}

    // Assigning token based on headers
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Check if the token exists
    if (!token) {
      errors.authentication =
        'You are not logged in! Please log in to gain access.'
      return res.status(401).json(errors)
    }

    // Decode jwt session token
    const jwtSecret = new TextEncoder().encode(process.env.NEXT_JWT_SECRET)
    const { payload } = await jwtVerify(token, jwtSecret, {
      algorithms: ['HS256'],
    })
    const decodedJwt = payload as { id: string; expires: string; iat: number }

    // Check if session is expired
    if (decodedJwt.expires < new Date().toString()) {
      errors.authentication = 'Access token is expired. Please log in again.'
      return res.status(401).json(errors)
    }

    // Find session with user id
    const session = await prisma.session.findUnique({
      where: {
        id: decodedJwt.id,
      },
    })

    // Check if the session exists
    if (!session) {
      errors.query = 'Error locating session. Please log in again.'
      return res.status(400).json(errors)
    }

    // Find current user with session data
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    })

    // Check if current user still exists
    if (!currentUser) {
      errors.query = 'The user related to this token no longer exists.'
      return res.status(401).json(errors)
    }

    // Check if user changed password after the token was issued TODO
    // if (await currentUser.changedPasswordAfter(decoded.iat)) {
    //   errors.changedPassword =
    //     'User has recently changed their password! Please log in again!'
    //   return res.status(401).json(errors)
    // }

    // Assign currentUser to req.user to be used in protected route functions
    // req.user = currentUser
    next()
  }
)

const restrictTo = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: { [key: string]: string } = {}

    // If the user's role is not included in the argument, deny access
    if (req.user && !roles.includes(req.user.role)) {
      errors.unauthorized = 'You do not have permission to perform this action.'
      return res.status(403).json(errors)
    }

    next()
  }
}

// TODO: Add error handling for prisma: https://stackoverflow.com/questions/75078929/how-to-handle-prisma-errors-and-send-a-valid-message-to-client
// TODO: Handle checks and responses better

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
    const errors: { [key: string]: string | { message: string }[] } = {}
    registrationSchema.parse(req.body)

    // Check if email is taken
    const emailCheck = await prisma.user.findUnique({
      where: { email: req.body.email },
    })

    if (emailCheck) {
      errors.error = 'Invalid data'
      errors.details = [{ message: 'email: Email already taken.' }]
      return res.status(400).json(errors)
    }

    // Check if username is taken
    const usernameCheck = await prisma.user.findUnique({
      where: { username: req.body.username },
    })

    if (usernameCheck) {
      errors.error = 'Invalid data'
      errors.details = [{ message: 'username: Username already taken.' }]
      return res.status(400).json(errors)
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: req.body,
    })

    if (!newUser) {
      errors.error = 'Bad gateway'
      errors.details = [{ message: 'Error creating new user.' }]
      return res.status(502).json(errors)
    }

    // Respond
    res.status(201).json(newUser)
  }
)

// @route   POST api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate body
    const errors: { [key: string]: string | { message: string }[] } = {}
    loginSchema.parse(req.body)

    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        password: true,
      },
    })

    // Error if no user or passwords don't match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      errors.error = 'Bad request'
      errors.details = [{ message: 'Email and/or password are incorrect.' }]
      return res.status(400).json(errors)
    }

    // Delete previous sessions
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    })

    const sessionExpirationDate = new Date()
    sessionExpirationDate.setDate(sessionExpirationDate.getDate() + 1)

    // Create user session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: sessionExpirationDate,
      },
    })

    if (!session) {
      errors.error = 'Bad gateway'
      errors.details = [{ message: 'Error creating new user.' }]
      return res.status(502).json(errors)
    }

    // Encode session into jwt
    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET)
    const jwt = await new SignJWT({ id: session.id, expires: session.expires })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(jwtSecret)

    res.status(200).json(jwt)
  }
)

// @route   GET api/v1/auth/sessions/:id
// @desc    Get user session
// @access  Public
const getSessionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await prisma.session.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        userId: true,
      },
    })

    if (!session) {
      res
        .status(400)
        .json({ errors: { session: 'No session found with provided id' } })

      return
    }

    res.status(200).json(session)
  } catch (error) {
    console.log(error)
    res.status(400).json({
      errors: { user: 'Error fetching session' },
    })
  }
}

// @route   DELETE api/v1/auth/sessions/:id
// @desc    Delete user session
// @access  Private
const deleteSessionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await prisma.session.delete({
      where: {
        id: req.params.id,
      },
    })

    if (!session) {
      res
        .status(400)
        .json({ errors: { session: 'No session found with provided id' } })

      return
    }

    res.status(200).json(session)
  } catch (error) {
    console.log(error)
    res.status(400).json({
      errors: { user: 'Error fetching session' },
    })
  }
}

export const authController = {
  protect,
  restrictTo,
  test,
  register,
  login,
  getSessionById,
  deleteSessionById,
}
