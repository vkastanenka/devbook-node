// controllers
import { controllerFactory } from '../lib/controller-factory'

// utils
import prisma from '../lib/db'

// types
import { Request, Response, NextFunction } from 'express'

////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
const test = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Users route secured' })
}

// @route   GET api/v1/users/:id
// @desc    Gets user matching id
// @access  Public
const getUser = controllerFactory.readRecord(prisma.user)

// @route   GET api/v1/users
// @desc    Get all users
// @access  Public
const getAllUsers = controllerFactory.readAllRecords(prisma.user)

// @route   POST api/v1/users
// @desc    Creates user
// @access  Public
const postUser = controllerFactory.createRecord(prisma.user)

// @route   PATCH api/v1/users/:id
// @desc    Updates user matching id
// @access  Public
const updateUser = controllerFactory.updateRecord(prisma.user)

// @route   DELETE api/v1/users/:id
// @desc    Deletes user matching id
// @access  Public
const deleteUser = controllerFactory.deleteRecord(prisma.user)

export const userController = {
  test,
  getUser,
  getAllUsers,
  postUser,
  updateUser,
  deleteUser,
}
