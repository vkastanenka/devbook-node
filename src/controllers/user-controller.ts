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

// @route   GET api/v1/users/users/:id
// @desc    Returns users matching id parameter
// @access  Public
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        headline: true,
        bio: true,
      },
    })

    if (!user) {
      res
        .status(400)
        .json({ errors: { user: 'No user found with provided id' } })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({
      errors: { user: 'Error fetching user' },
    })
    console.log(error)
  }
}

const userController = { test, getUserById }

export default userController
