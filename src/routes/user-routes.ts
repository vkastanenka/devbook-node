// express
import express from 'express'
const router = express.Router()

// controllers
import userController from '../controllers/user-controller'

/////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', userController.test)

// @route   GET api/v1/users/:id
// @desc    Returns user matching id parameter
// @access  Public
router.get("/:id", userController.getUserById);

export default router