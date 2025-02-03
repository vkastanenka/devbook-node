// express
import express from "express";

// controllers
import { authController } from "../controllers/auth-controller";

// Set up router
const router = express.Router();

/////////////////
// Public Routes

// @route   GET api/v1/auth/test
// @desc    Tests auths route
// @access  Public
router.get("/test", authController.authTest);

export const authRouter = router;
