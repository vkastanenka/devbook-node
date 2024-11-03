// utils
import prisma from '../lib/db'

import { AppError } from '../lib/error/app-error'
import { AppResponse } from '../lib/utils/app-response'
import { catchAsync } from '../lib/error/catch-async'
import { controllerFactory } from '../lib/utils/controller-factory'

// types
import { HttpStatusCode } from '../types/http-status-code'
import { Request, Response, NextFunction } from 'express'

// validation
import { userReadUsernameReqBodySchema } from '../validation/user'

// Tests users route
const userTest = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Users route secured' })
  return
}

// Returns user associated with session JWT
const userGetCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.currentUser) {
    new AppResponse({
      data: req.currentUser,
      message: 'Current user found!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }

  throw new AppError({
    message: 'Current user not found!',
    statusCode: HttpStatusCode.NOT_FOUND,
  })
}

// Gets user with relations
const userReadUsername = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate body
    userReadUsernameReqBodySchema.parse({ username: req.params.username })

    // Find username
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
    })

    if (!user) {
      throw new AppError({
        message: 'User not found!',
        statusCode: HttpStatusCode.NOT_FOUND,
      })
    }

    // Respond
    new AppResponse({
      data: user,
      message: 'User found!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

// Read user
const userReadUser = controllerFactory.readRecord(prisma.user)

// Read all users
const userReadAllUsers = controllerFactory.readAllRecords(prisma.user)

// Create user
const userCreateUser = controllerFactory.createRecord(prisma.user)

// Update user
const userUpdateUser = controllerFactory.updateRecord(prisma.user)

// Delete user
const userDeleteUser = controllerFactory.deleteRecord(prisma.user)

export const userController = {
  userTest,
  userCreateUser,
  userReadUser,
  userReadAllUsers,
  userUpdateUser,
  userDeleteUser,
  userGetCurrentUser,
  userReadUsername,
}
