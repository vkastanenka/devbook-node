// express
import express from "express";

// controllers
import { searchController } from "../controllers/search-controller";

// Set up router
const router = express.Router();

/////////////////
// Public Routes

// @route   GET api/v1/search/test
// @desc    Tests search route
// @access  Public
router.get("/test", searchController.searchTest);

export const searchRouter = router;
