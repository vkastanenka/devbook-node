// utils
import prisma from '../lib/db'
import { SignJWT } from 'jose'

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
