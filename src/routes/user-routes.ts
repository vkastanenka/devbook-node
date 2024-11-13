// express
import express from 'express'

// controllers
import { userController } from '../controllers/user-controller'

// utils
import prisma from '../lib/db'

import { protect } from '../lib/auth/protect'
import { restrict } from '../lib/auth/restrict'

// types
import { UserRole } from '@prisma/client'

// validation
import { userValidation } from '../validation/user'
import {
  validateCurrentUserRecordCreation,
  validateCurrentUserRecordOwnership,
  validateReqBody,
} from '../validation'

// Set up router
const router = express.Router()

/////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', userController.userTest)

///////////////////
// Protected Routes

router.use(protect)

// @route   Get api/v1/users/username/:username
// @desc    Reads user with relations
// @access  Protected
router.post('/username/:username', userController.userReadUsername)

// Current user

// @route   POST api/v1/users/current-user/user
// @desc    Returns user associated with JWT
// @access  Protected
router.post('/current-user/user', userController.userReadCurrentUser)

// @route   POST api/v1/users/current-user/feed
// @desc    Returns user associated with JWT
// @access  Protected
router.get('/current-user/feed', userController.userReadCurrentUserFeed)

// @route   PATCH api/v1/users/current-user/user/:id
// @desc    Updates current user
// @access  Protected
router.patch(
  '/current-user/user/:id',
  validateCurrentUserRecordOwnership({ idField: 'id', model: prisma.user }),
  validateReqBody({ schema: userValidation.userUpdateUserReqBodySchema }),
  userController.userUpdateUser
)

// UserEducation

// @route   POST api/v1/posts/current-user/education
// @desc    Creates current user education
// @access  Protected
router.post(
  '/current-user/education',
  validateCurrentUserRecordCreation,
  validateReqBody({ schema: userValidation.userCreateEducationReqBodySchema }),
  userController.userCreateEducation
)

// @route   PATCH api/v1/posts/current-user/education/:id
// @desc    Updates current user education
// @access  Protected
router.patch(
  '/current-user/education/:id',
  validateCurrentUserRecordOwnership({ model: prisma.userEducation }),
  validateReqBody({ schema: userValidation.userUpdateEducationReqBodySchema }),
  userController.userUpdateEducation
)

// @route   DELETE api/v1/posts/current-user/education/:id
// @desc    Deletes current user education
// @access  Protected
router.delete(
  '/current-user/education/:id',
  validateCurrentUserRecordOwnership({ model: prisma.userEducation }),
  userController.userDeleteEducation
)

// UserExperience

// @route   POST api/v1/posts/current-user/experience
// @desc    Creates current user experience
// @access  Protected
router.post(
  '/current-user/experience',
  validateCurrentUserRecordCreation,
  validateReqBody({ schema: userValidation.userCreateExperienceReqBodySchema }),
  userController.userCreateExperience
)

// @route   PATCH api/v1/posts/current-user/experience/:id
// @desc    Updates current user experience
// @access  Protected
router.patch(
  '/current-user/experience/:id',
  validateCurrentUserRecordOwnership({ model: prisma.userExperience }),
  validateReqBody({ schema: userValidation.userUpdateExperienceReqBodySchema }),
  userController.userUpdateExperience
)

// @route   DELETE api/v1/posts/current-user/experience/:id
// @desc    Deletes current user experience
// @access  Protected
router.delete(
  '/current-user/experience/:id',
  validateCurrentUserRecordOwnership({ model: prisma.userExperience }),
  userController.userDeleteExperience
)

////////////////////
// Restricted Routes

router.use(restrict([UserRole.ADMIN]))

// User

// @route   PATCH api/v1/users/user/:id
// @desc    Updates user matching id
// @access  Restricted
router.patch('/user/:id', userController.userUpdateUser)

// @route   GET api/v1/users/user/:id
// @desc    Returns user matching id parameter
// @access  Restricted
router.get('/user/:id', userController.userReadUser)

// @route   GET api/v1/users/users
// @desc    Get all users
// @access  Restricted
router.get('/users', userController.userReadAllUsers)

// @route   POST api/v1/users/user
// @desc    Creates user
// @access  Restricted
router.post('/user', userController.userCreateUser)

// @route   DELETE api/v1/users/user/:id
// @desc    Deletes user matching id
// @access  Restricted
router.delete('/user/:id', userController.userDeleteUser)

// UserEducation

// @route   POST api/v1/users/education
// @desc    Creates education
// @access  Restricted
router.post('/education', userController.userCreateEducation)

// @route   GET api/v1/users/education/:id
// @desc    Returns education matching id parameter
// @access  Restricted
router.get('/education/:id', userController.userReadEducation)

// @route   GET api/v1/users/educations
// @desc    Get all educations
// @access  Restricted
router.get('/educations', userController.userReadAllEducations)

// @route   PATCH api/v1/users/education/:id
// @desc    Updates education matching id
// @access  Restricted
router.patch('/education/:id', userController.userUpdateEducation)

// @route   DELETE api/v1/users/education/:id
// @desc    Deletes education matching id
// @access  Restricted
router.delete('/education/:id', userController.userDeleteEducation)

// UserExperience

// @route   POST api/v1/users/experience
// @desc    Creates experience
// @access  Restricted
router.post('/experience', userController.userCreateExperience)

// @route   GET api/v1/users/experience/:id
// @desc    Returns experience matching id parameter
// @access  Restricted
router.get('/experience/:id', userController.userReadExperience)

// @route   GET api/v1/users/experiences
// @desc    Get all experiences
// @access  Restricted
router.get('/experiences', userController.userReadAllExperiences)

// @route   PATCH api/v1/users/experience/:id
// @desc    Updates experience matching id
// @access  Restricted
router.patch('/experience/:id', userController.userUpdateExperience)

// @route   DELETE api/v1/users/experience/:id
// @desc    Deletes experience matching id
// @access  Restricted
router.delete('/experience/:id', userController.userDeleteExperience)

export const userRouter = router
