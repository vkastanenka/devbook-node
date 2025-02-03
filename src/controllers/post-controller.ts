// utils
import { AppResponse } from "../lib/utils/app-response";

// types
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@vkastanenka/devbook-types/dist";

// Test post route
const postTest = (req: Request, res: Response, next: NextFunction) => {
  // Respond
  new AppResponse({
    message: "Post route secured",
    res,
    statusCode: HttpStatusCode.OK,
  }).respond();
  return;
};

export const postController = {
  postTest,
};
