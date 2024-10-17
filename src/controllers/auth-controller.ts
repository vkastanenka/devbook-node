// utils
import prisma from '../lib/db'
import { SignJWT, jwtVerify } from 'jose'
import { v4 as uuidv4 } from 'uuid'
import { catchAsync } from '../lib/catchAsync'

// types
import { Request, Response, NextFunction } from 'express'

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
    req.user = currentUser
    next()
  }
)

/////////////////
// Public Routes

// @route   GET api/v1/auth/test
// @desc    Tests auth route
// @access  Public
const test = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Auth route secured' })
}

// @route   GET api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    })

    if (!user) {
      res
        .status(400)
        .json({ errors: { user: 'No session found with the provided email' } })

      return
    }

    const deletedSessions = await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    })

    if (!deletedSessions) {
      res.status(400).json({
        errors: { user: 'Unable to delete previous sessions' },
      })

      return
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: uuidv4(), // TODO: Remove
        expires: new Date().setDate(new Date().getDate() + 1).toString(),
      },
    })

    if (!session) {
      res.status(400).json({
        errors: { user: 'Unable to create session' },
      })

      return
    }

    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET)
    const jwt = await new SignJWT({ id: session.id, expires: session.expires })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1 day')
      .sign(jwtSecret)

    res.status(200).json(jwt)

    return
  } catch (error) {
    console.log(error)
    res.status(400).json({
      errors: { user: 'Error fetching session' },
    })
  }
}

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
  test,
  login,
  getSessionById,
  deleteSessionById,
}
