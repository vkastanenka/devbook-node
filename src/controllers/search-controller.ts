// utils
import prisma from '../lib/db'

import { AppError } from '../lib/error/app-error'
import { AppResponse } from '../lib/utils/app-response'
import { catchAsync } from '../lib/error/catch-async'

// types
import { HttpStatusCode } from '../types/http-status-code'
import { Request, Response, NextFunction } from 'express'

// validation
import { searchDevbookReqBodySchema } from '../validation/search'

// Tests search route
const searchTest = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Search route secured' })
  return
}


// Returns models matching provided query
const searchDevbook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate body
    searchDevbookReqBodySchema.parse(req.body)

    // Find users whose name or username contains the query
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: req.body.query,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: req.body.query,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    if (!users?.length) {
      throw new AppError({
        message: `Results not found!`,
        statusCode: HttpStatusCode.NOT_FOUND,
      })
    }

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
