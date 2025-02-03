// utils
import prisma from "../lib/db";

import { crudFactory } from "../lib/utils/crud-factory";

// types
import { Request, Response, NextFunction } from "express";

// Tests addresses route
const addressTest = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Addresses route secured" });
  return;
};

// Address
const addressCreateAddress = crudFactory.createRecord(prisma.address);
const addressReadAddress = crudFactory.readRecord(prisma.address);
const addressReadAllAddresses = crudFactory.readAllRecords(prisma.address);
const addressUpdateAddress = crudFactory.updateRecord(prisma.address);
const addressDeleteAddress = crudFactory.deleteRecord(prisma.address);

export const addressController = {
  addressTest,
  addressCreateAddress,
  addressReadAddress,
  addressReadAllAddresses,
  addressUpdateAddress,
  addressDeleteAddress,
};
