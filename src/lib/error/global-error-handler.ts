// utils
import { AppError } from "./app-error";
import { Prisma } from "@vkastanenka/devbook-prisma";

// types
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// constants
import { HttpStatusCode } from "@vkastanenka/devbook-types/dist";

// Prisma client known request error handler
const handlePrismaClientKnownRequestError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (err.code) {
    // "Unique constraint failed on the {constraint}"
    case "P2002":
      return new AppError({
        errors: { [`${err.meta.target}`]: "Duplicate field value" },
        message: `Unique constraint failed for: ${err.meta.target}`,
        statusCode: HttpStatusCode.BAD_REQUEST,
      });

    // "Null constraint violation on the {constraint}"
    case "P2011":
      const errors: { [key: string | number]: string } = {};

      err.meta.constraint.forEach((field: string) => {
        errors[field] = `${field} is required`;
      });

      return new AppError({
        errors,
        message: "Missing input(s)",
        statusCode: HttpStatusCode.BAD_REQUEST,
      });

    // "An operation failed because it depends on one or more records that were required but not found. {cause}"
    case "P2025":
      return new AppError({
        errors: { [err.meta.modelName]: err.meta.cause },
        message: "Record(s) not found",
        statusCode: HttpStatusCode.NOT_FOUND,
      });

    // handling all other errors
    default:
      return new AppError({
        errors: { [err.meta.modelName]: err.meta.cause },
        message: `Something went wrong with model ${err.meta.modelName}: ${err.meta.cause}`,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
  }
};

// Prisma client validation error handler
const handlePrismaClientValidationError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const splitMessage = err.message.split("\n");
  const test = splitMessage[splitMessage.length - 1];

  return new AppError({
    errors: { [err.name]: test },
    message: `Prisma client validation error: ${test}`,
    statusCode: HttpStatusCode.BAD_REQUEST,
  });
};

// Zod error handler
const handleZodError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: { [key: string | number]: string } = {};

  err.errors.forEach((issue: any) => {
    errors[issue.path.join(".")] = issue.message;
  });

  return new AppError({
    message: `Input validation error`,
    statusCode: HttpStatusCode.BAD_REQUEST,
    errors,
  });
};

// Send error messages
const sendError = (err: any, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      errors: err.errors,
      message: err.message,
      status: err.status,
      statusCode: err.statusCode,
      success: err.success,
    });
  }

  // Rendered Website
  console.error("ERROR 💥", err);

  return res.status(err.statusCode).json({
    errors: err.errors,
    message: err.message,
    status: err.status,
    statusCode: err.statusCode,
    success: err.success,
  });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  // Prisma error handling
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.log("Prisma client known request error!");
    err = handlePrismaClientKnownRequestError(err, req, res, next);
  }

  // Prisma error handling
  if (err instanceof Prisma.PrismaClientValidationError) {
    console.log("Prisma client validation error!");
    err = handlePrismaClientValidationError(err, req, res, next);
  }

  // Zod error handling
  if (err instanceof ZodError) {
    console.log("Zod error!");
    err = handleZodError(err, req, res, next);
  }

  sendError(err, req, res);
};
