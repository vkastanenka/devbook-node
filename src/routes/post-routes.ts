// express
import express from "express";

// controllers
import { postController } from "../controllers/post-controller";

// Set up router
const router = express.Router();

/////////////////
// Public Routes

// @route   GET api/v1/posts/test
// @desc    Tests posts route
// @access  Public
router.get("/test", postController.postTest);

export const postRouter = router;
