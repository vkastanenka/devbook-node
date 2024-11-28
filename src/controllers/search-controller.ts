// utils
import prisma from '../lib/db'

import { AppResponse } from '../lib/utils/app-response'
import { catchAsync } from '../lib/error/catch-async'

// types
import { Request, Response, NextFunction } from 'express'
import { HttpStatusCode } from '@vkastanenka/devbook-types/dist'
import { SearchDevbookReqBody } from '@vkastanenka/devbook-types/dist/search'

// Tests search route
const searchTest = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Search route secured' })
  return
}

// Returns models matching provided query
const searchDevbook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: SearchDevbookReqBody = req.body

    // Find users whose name or username contains the query
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: reqBody.query,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: reqBody.query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        contacts: {
          select: { id: true },
        },
      },
    })

    // Respond
    new AppResponse({
      data: users,
      message: 'Results found!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  }
)

export const searchController = {
  searchTest,
  searchDevbook,
}
