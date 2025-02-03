// express
import express from "express";

// controllers
import { addressController } from "../controllers/address-controller";

// Set up router
const router = express.Router();

/////////////////
// Public Routes

// @route   GET api/v1/addresses/test
// @desc    Tests addresses route
// @access  Public
router.get("/test", addressController.addressTest);

export const addressRouter = router;
