// express
import express from "express";

// controllers
import { addressController } from "../controllers/address-controller";

// utils
import prisma from "../lib/db";

import { protect } from "../lib/auth/protect";
import { restrict } from "../lib/auth/restrict";

// types
import { UserRole } from "@vkastanenka/devbook-prisma";

// validation
import {
  addressCreateAddressReqBodySchema,
  addressUpdateAddressReqBodySchema,
} from "@vkastanenka/devbook-validation/dist/address";
import {
  validateCurrentUserRecordCreation,
  validateCurrentUserRecordOwnership,
  validateReqBody,
} from "../validation";

// Set up router
const router = express.Router();

/////////////////
// Public Routes

// @route   GET api/v1/addresses/test
// @desc    Tests addresses route
// @access  Public
router.get("/test", addressController.addressTest);

///////////////////
// Protected Routes

router.use(protect);

// @route   POST api/v1/addresses/current-user/address
// @desc    Creates current user address
// @access  Protected
router.post(
  "/current-user/address",
  validateCurrentUserRecordCreation,
  validateReqBody({
    schema: addressCreateAddressReqBodySchema,
  }),
  addressController.addressCreateAddress
);

// @route   PATCH api/v1/addresses/current-user/address/:id
// @desc    Updates current user address
// @access  Protected
router.patch(
  "/current-user/address/:id",
  validateCurrentUserRecordOwnership({ model: prisma.address }),
  validateReqBody({
    schema: addressUpdateAddressReqBodySchema,
  }),
  addressController.addressUpdateAddress
);

////////////////////
// Restricted Routes

router.use(restrict([UserRole.ADMIN]));

// @route   POST api/v1/addresses/address
// @desc    Creates address
// @access  Restricted
router.post("/address", addressController.addressCreateAddress);

// @route   GET api/v1/addresses/address/:id
// @desc    Returns address matching id parameter
// @access  Restricted
router.get("/address/:id", addressController.addressReadAddress);

// @route   GET api/v1/addresses/addresses
// @desc    Get all addresses
// @access  Restricted
router.get("/addresses", addressController.addressReadAllAddresses);

// @route   PATCH api/v1/addresses/address/:id
// @desc    Updates address matching id
// @access  Restricted
router.patch("/address/:id", addressController.addressUpdateAddress);

// @route   DELETE api/v1/addresses/address/:id
// @desc    Deletes address matching id
// @access  Restricted
router.delete("/address/:id", addressController.addressDeleteAddress);

export const addressRouter = router;
