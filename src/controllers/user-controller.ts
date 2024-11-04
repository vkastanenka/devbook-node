// utils
import prisma from '../lib/db'

import { AppError } from '../lib/error/app-error'
import { AppResponse } from '../lib/utils/app-response'
import { catchAsync } from '../lib/error/catch-async'
import { crudFactory } from '../lib/utils/crud-factory'

// types
import { HttpStatusCode } from '../types/http-status-code'
import { Request, Response, NextFunction } from 'express'

// Tests users route
const userTest = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Users route secured' })
  return
}

// Returns user associated with session JWT
const userReadCurrentUser = (
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

// Get user based on username
const userReadUsername = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

// User
const userReadUser = crudFactory.readRecord(prisma.user)
const userReadAllUsers = crudFactory.readAllRecords(prisma.user)
const userCreateUser = crudFactory.createRecord(prisma.user)
const userUpdateUser = crudFactory.updateRecord(prisma.user)
const userDeleteUser = crudFactory.deleteRecord(prisma.user)

// UserEducation
const userReadEducation = crudFactory.readRecord(prisma.userEducation)
const userReadAllEducations = crudFactory.readAllRecords(prisma.userEducation)
const userCreateEducation = crudFactory.createRecord(prisma.userEducation)
const userUpdateEducation = crudFactory.updateRecord(prisma.userEducation)
const userDeleteEducation = crudFactory.deleteRecord(prisma.userEducation)

// UserExperience
const userReadExperience = crudFactory.readRecord(prisma.userExperience)
const userReadAllExperiences = crudFactory.readAllRecords(prisma.userExperience)
const userCreateExperience = crudFactory.createRecord(prisma.userExperience)
const userUpdateExperience = crudFactory.updateRecord(prisma.userExperience)
const userDeleteExperience = crudFactory.deleteRecord(prisma.userExperience)

export const userController = {
  userTest,
  userCreateUser,
  userReadUser,
  userReadAllUsers,
  userUpdateUser,
  userDeleteUser,
  userReadCurrentUser,
  userReadUsername,
  userReadEducation,
  userReadAllEducations,
  userCreateEducation,
  userUpdateEducation,
  userDeleteEducation,
  userReadExperience,
  userReadAllExperiences,
  userCreateExperience,
  userUpdateExperience,
  userDeleteExperience,
}
