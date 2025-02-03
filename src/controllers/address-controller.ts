// utils
import { AppResponse } from "../lib/utils/app-response";

// types
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@vkastanenka/devbook-types/dist";

// Tests addresses route
const addressTest = (req: Request, res: Response, next: NextFunction) => {
  new AppResponse({
    message: "Address route secured",
    res,
    statusCode: HttpStatusCode.OK,
  }).respond();
  return;
};

export const addressController = {
  addressTest,
};
