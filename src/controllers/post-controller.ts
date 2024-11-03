// utils
import prisma from '../lib/db'

import { controllerFactory } from '../lib/utils/controller-factory'

// types
import { Request, Response, NextFunction } from 'express'

// Tests users route
const postTest = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Users route secured' })
  return
}

// Get user
const postReadPost = controllerFactory.readRecord(prisma.post)

// Get all users
const postReadAllPosts = controllerFactory.readAllRecords(prisma.post)

// Creates user
const postCreatePost = controllerFactory.createRecord(prisma.post)

// Updates user matching id
const postUpdatePost = controllerFactory.updateRecord(prisma.post)

// Deletes user matching id
const postDeletePost = controllerFactory.deleteRecord(prisma.post)

export const postController = {
  postTest,
  postCreatePost,
  postReadPost,
  postReadAllPosts,
  postUpdatePost,
  postDeletePost,
}
