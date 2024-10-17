// express
import express from 'express'
const router = express.Router()

// controllers
import {
  test,
  getUser,
  postUser,
  updateUser,
  deleteUser,
} from '../controllers/user-controller'

/////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', test)

// @route   GET api/v1/users/:id
// @desc    Returns user matching id parameter
// @access  Public
router.get('/:id', getUser)

// @route   POST api/v1/users
// @desc    Creates user
// @access  Public
router.post('', postUser)

// @route   PATCH api/v1/users/:id
// @desc    Updates user matching id
// @access  Public
router.patch('/:id', updateUser)

// @route   DELETE api/v1/users/:id
// @desc    Deletes user matching id
// @access  Public
router.delete('/:id', deleteUser)

export const userRouter = router
