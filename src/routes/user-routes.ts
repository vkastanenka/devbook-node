// express
import express from "express";

// controllers
import { userController } from "../controllers/user-controller";

// Set up router
const router = express.Router();

/////////////////
// Public Routes

// @route   GET api/v1/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", userController.userTest);

export const userRouter = router;
