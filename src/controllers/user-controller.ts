// controllers
import { catchAsync } from '../lib/catch-async'
import { controllerFactory } from '../lib/controller-factory'

// utils
import prisma from '../lib/db'
import { responseService } from '../lib/response-service'

// types
import { Request, Response, NextFunction } from 'express'

// Tests users route
const test = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Users route secured' })
  return
}

// Gets user matching id
const getUser = controllerFactory.readRecord(prisma.user)

// Get many users
const getManyUsers = controllerFactory

// Get all users
const getAllUsers = controllerFactory.readAllRecords(prisma.user)

// Creates user
const postUser = controllerFactory.createRecord(prisma.user)

// Updates user matching id
const updateUser = controllerFactory.updateRecord(prisma.user)

// Deletes user matching id
const deleteUser = controllerFactory.deleteRecord(prisma.user)

// Returns user associated with JWT
const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    res.status(responseService.statusCodes.ok).json(
      responseService.ok({
        message: 'Found current user!',
        data: req.user,
      })
    )
    return
  } else {
    res
      .status(responseService.statusCodes.notFound)
      .json(responseService.notFound({ message: 'Current user not found!' }))
    return
  }
}

// Returns users found with provided query
const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.params

    const users = await prisma.user.findMany({
      orderBy: [
        {
          name: 'desc',
        },
      ],
      where: {
        OR: [
          {
            name: {
              contains: q,
            },
          },
          {
            username: {
              contains: q,
            },
          },
        ],
      },
    })

    if (!users?.length) {
      res
        .status(responseService.statusCodes.notFound)
        .json(responseService.notFound({ message: 'No results found!' }))
      return
    }

    res
      .status(responseService.statusCodes.ok)
      .json(responseService.ok({ message: 'Results found!', data: users }))
    return
  }
)

export const userController = {
  test,
  getUser,
  getAllUsers,
  postUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  getUsers,
}
