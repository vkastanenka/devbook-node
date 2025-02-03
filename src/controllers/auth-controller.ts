// utils
import { AppResponse } from "../lib/utils/app-response";

// types
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@vkastanenka/devbook-types/dist";

// Test auth route
const authTest = (req: Request, res: Response, next: NextFunction) => {
  // Respond
  new AppResponse({
    message: "Auth route secured",
    res,
    statusCode: HttpStatusCode.OK,
  }).respond();
  return;
};

export const authController = {
  authTest,
};
