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

// Get user based on username
const userReadUsername = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Find username
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      ...req.body,
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

// Returns user associated with session JWT
const userReadCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.currentUser && req.body) {
      const currentUser = await prisma.user.findUnique({
        where: { id: req.currentUser.id },
        ...req.body,
      })

      new AppResponse({
        data: currentUser,
        message: 'Current user found!',
        res,
        statusCode: HttpStatusCode.OK,
      }).respond()
      return
    }

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
)

// Returns current user feed
const userReadCurrentUserFeed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.currentUser?.id },
      include: {
        contacts: true,
      },
    })

    const contactIdFilters = currentUser?.contacts.map((contact) => ({
      userId: {
        equals: contact.id,
      },
    }))

    const posts = await prisma.post.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        OR: [
          {
            userId: {
              equals: req.currentUser?.id,
            },
          },
          ...(contactIdFilters ? contactIdFilters : []),
        ],
      },
      include: {
        _count: { select: { comments: true, postLikes: true } },
        postLikes: true,
        user: true,
      },
    })

    new AppResponse({
      data: posts,
      message: 'Current user feed found!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

// User
const userCreateUser = crudFactory.createRecord(prisma.user)
const userReadUser = crudFactory.readRecord(prisma.user)
const userReadAllUsers = crudFactory.readAllRecords(prisma.user)
const userUpdateUser = crudFactory.updateRecord(prisma.user)
const userDeleteUser = crudFactory.deleteRecord(prisma.user)

// UserEducation
const userCreateEducation = crudFactory.createRecord(prisma.userEducation)
const userReadEducation = crudFactory.readRecord(prisma.userEducation)
const userReadAllEducations = crudFactory.readAllRecords(prisma.userEducation)
const userUpdateEducation = crudFactory.updateRecord(prisma.userEducation)
const userDeleteEducation = crudFactory.deleteRecord(prisma.userEducation)

// UserExperience
const userCreateExperience = crudFactory.createRecord(prisma.userExperience)
const userReadExperience = crudFactory.readRecord(prisma.userExperience)
const userReadAllExperiences = crudFactory.readAllRecords(prisma.userExperience)
const userUpdateExperience = crudFactory.updateRecord(prisma.userExperience)
const userDeleteExperience = crudFactory.deleteRecord(prisma.userExperience)

export const userController = {
  userTest,
  userReadUsername,
  userReadCurrentUser,
  userReadCurrentUserFeed,
  userCreateUser,
  userReadUser,
  userReadAllUsers,
  userUpdateUser,
  userDeleteUser,
  userCreateEducation,
  userReadEducation,
  userReadAllEducations,
  userUpdateEducation,
  userDeleteEducation,
  userCreateExperience,
  userReadExperience,
  userReadAllExperiences,
  userUpdateExperience,
  userDeleteExperience,
}
