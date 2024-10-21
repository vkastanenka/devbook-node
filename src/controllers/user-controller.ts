// controllers
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

// Returns user associated with JWT
const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    res
      .status(responseService.statusCodes.ok)
      .json(responseService.success('Found current user!', req.user))
    return
  } else {
    res
      .status(responseService.statusCodes.notFound)
      .json(responseService.success('Current user not found!', req.user))
    return
  }
}

// Gets user matching id
const getUser = controllerFactory.readRecord(prisma.user)

// Get all users
const getAllUsers = controllerFactory.readAllRecords(prisma.user)

// Creates user
const postUser = controllerFactory.createRecord(prisma.user)

// Updates user matching id
const updateUser = controllerFactory.updateRecord(prisma.user)

// Deletes user matching id
const deleteUser = controllerFactory.deleteRecord(prisma.user)

export const userController = {
  test,
  getCurrentUser,
  getUser,
  getAllUsers,
  postUser,
  updateUser,
  deleteUser,
}
