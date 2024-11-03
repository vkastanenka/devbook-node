// express
import express from 'express'

// controllers
import { searchController } from '../controllers/search-controller'

// utils
import { protect } from '../lib/auth/protect'

// Set up router
const router = express.Router()

///////////////////
// Protected Routes

router.use(protect)

// @route   GET api/v1/search/devbook
// @desc    Returns users whose name or username includes the body query
// @access  Protected
router.get('/devbook', searchController.searchDevbook)

export const searchRouter = router
