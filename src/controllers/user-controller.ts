// utils
import prisma from '../lib/db'
import {
  createRecord,
  readRecord,
  updateRecord,
  deleteRecord,
} from '../lib/controllerFactory'

// types
import { Request, Response, NextFunction } from 'express'

////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
export const test = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Users route secured' })
}

// @route   GET api/v1/users/:id
// @desc    Gets user matching id
// @access  Public
export const getUser = readRecord(prisma.user)

// @route   POST api/v1/users
// @desc    Creates user
// @access  Public
export const postUser = createRecord(prisma.user)

// @route   PATCH api/v1/users/:id
// @desc    Updates user matching id
// @access  Public
export const updateUser = updateRecord(prisma.user)

// @route   DELETE api/v1/users/:id
// @desc    Deletes user matching id
// @access  Public
export const deleteUser = deleteRecord(prisma.user)