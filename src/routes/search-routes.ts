// express
import express from 'express'

// controllers
import { searchController } from '../controllers/search-controller'

// utils
import { protect } from '../lib/auth/protect'

// validation
import { searchDevbookReqBodySchema } from '@vkastanenka/devbook-validation/dist/search'
import { validateReqBody } from '../validation'

// Set up router
const router = express.Router()

/////////////////
// Public Routes

// @route   GET api/v1/search/test
// @desc    Tests search route
// @access  Public
router.get('/test', searchController.searchTest)

///////////////////
// Protected Routes

router.use(protect)

// @route   POST api/v1/search/devbook
// @desc    Returns users whose name or username includes the body query
// @access  Protected
router.post(
  '/devbook',
  validateReqBody({ schema: searchDevbookReqBodySchema }),
  searchController.searchDevbook
)

export const searchRouter = router
