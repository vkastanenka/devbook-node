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

// Get all users
const getUser = controllerFactory.readRecord(prisma.user)

// Get all users
const getAllUsers = controllerFactory.readAllRecords(prisma.user)

// Creates user
const createUser = controllerFactory.createRecord(prisma.user)

// Updates user matching id
const updateUser = controllerFactory.updateRecord(prisma.user)

// Deletes user matching id
const deleteUser = controllerFactory.deleteRecord(prisma.user)

// Returns user associated with session JWT
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

// Returns models matching provided query
const getUserDevbookSearch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Zod validation

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            id: {
              equals: req.params.q,
            },
          },
          {
            username: {
              equals: req.params.q,
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

// Gets user with relations
const getUsername = catchAsync(
  // TODO: Zod validation

  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      ...(req.body.include ? { include: req.body.include } : {}),
    })

    if (!user) {
      res
        .status(responseService.statusCodes.notFound)
        .json(responseService.notFound({ message: 'No user found!' }))
      return
    }

    res.status(responseService.statusCodes.ok).json(
      responseService.ok({
        message: 'User found!',
        data: user,
      })
    )
    return
  }
)

export const userController = {
  test,
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  getUserDevbookSearch,
  getUsername,
}
