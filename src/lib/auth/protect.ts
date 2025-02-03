// utils
import jsonwebtoken from 'jsonwebtoken'
import prisma from '../db'

import { AppError } from '../error/app-error'
import { catchAsync } from '../error/catch-async'

// types
import { HttpStatusCode } from '@vkastanenka/devbook-types/dist'
import { Request, Response, NextFunction } from 'express'

// Privatizes routes and makes accessible only to users with valid jwt session token
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Assigning token based on headers
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Check if the token exists
    if (!token) {
      throw new AppError({
        message: 'Invalid token. Please log in again!',
        statusCode: HttpStatusCode.UNAUTHORIZED,
      })
    }

    // Decode jwt session token
    const decodedJwt = (await jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET || ''
    )) as jsonwebtoken.JwtPayload

    // Check if session is expired
    if (decodedJwt.expires < new Date()) {
      throw new AppError({
        message: 'Token is expired. Please log in again!',
        statusCode: HttpStatusCode.UNAUTHORIZED,
      })
    }

    // Find session that has user id
    const session = await prisma.session.findUnique({
      where: {
        id: decodedJwt.id,
      },
    })

    // Check if the session exists
    if (!session) {
      throw new AppError({
        message: 'Session not found. Please log in again!',
        statusCode: HttpStatusCode.NOT_FOUND,
      })
    }

    // Check if the session is expired
    if (session.expires < new Date()) {
      throw new AppError({
        message: 'Session has expired. Please log in again!',
        statusCode: HttpStatusCode.NOT_FOUND,
      })
    }

    // Find current user with session data
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    })

    // Check if current user still exists
    if (!currentUser) {
      throw new AppError({
        message: 'Current user not found!',
        statusCode: HttpStatusCode.NOT_FOUND,
      })
    }

    // Check if user changed password after the token was issued
    if (
      currentUser.passwordUpdatedAt &&
      currentUser.passwordUpdatedAt > session.expires
    ) {
      throw new AppError({
        message: 'Current user changed their password. Please log in again!',
        statusCode: HttpStatusCode.UNAUTHORIZED,
      })
    }

    // Assign currentUser to req.user to be used in protected route functions
    req.currentUser = currentUser

    next()
  }
)
