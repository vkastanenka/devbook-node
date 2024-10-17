// Set up router
const express = require('express')
const userRouter = express.Router()

// Load controllers
import { login } from '../controllers/authController'

/////////////////
// Public Routes

// @route   GET api/v1/auth/login
// @desc    Login User / JWT Response
// @access  Public
userRouter.post('/login', login)

export default userRouter
