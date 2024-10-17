// utils
import prisma from '../lib/db'
import { SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'

// types
import { Request, Response, NextFunction } from 'express'

/////////////////
// Public Routes

// @route   GET api/v1/auth/test
// @desc    Tests auth route
// @access  Public
export const test = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Auth route secured' })
}

// @route   GET api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: uuidv4(),
        expires: new Date(),
      },
    })

    const sessionData = await prisma.session.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
      },
    })

    if (!sessionData) {
      res.status(400).json({
        errors: { user: 'Error creating user session' },
      })

      return
    }

    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET)
    const jwt = await new SignJWT(sessionData)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      //   .setExpirationTime('10 sec from now')
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
export const getSessionById = async (
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

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const jwt = await new SignJWT(session || {})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      //   .setExpirationTime('10 sec from now')
      .sign(secret)

    res.status(200).json(jwt)
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
export const deleteSessionById = async (
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
