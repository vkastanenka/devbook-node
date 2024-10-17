// types
import { Request, Response, NextFunction } from 'express'
import { SignJWT } from 'jose'

const user = {
  id: '12345',
  name: 'Victoria Kastanenka',
  email: 'vkastanenka@gmail.com',
  username: 'Victoria23'
}

/////////////////
// Public Routes

// @route   GET api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const { email, password }: LoginBody = req.body

  // Get user from database TODO

  // Create the JWT => User
  const payload = user
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10 sec from now')
    .sign(secret)

  res.status(200).json(jwt)
}
