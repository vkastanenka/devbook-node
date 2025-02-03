// utils
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import prisma from "../lib/db";

import { addMinutes, addDays } from "date-fns";
import { AppError } from "../lib/error/app-error";
import { AppResponse } from "../lib/utils/app-response";
import { catchAsync } from "../lib/error/catch-async";
import { crudFactory } from "../lib/utils/crud-factory";
import { createHash, randomBytes } from "node:crypto";
import { sendResetPasswordTokenEmail } from "../lib/utils/email";

// types
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@vkastanenka/devbook-types/dist";
import {
  AuthLoginReqBody,
  AuthRegisterReqBody,
  AuthSendResetPasswordTokenReqBody,
  AuthResetPasswordReqBody,
  AuthUpdatePasswordReqBody,
} from "@vkastanenka/devbook-types/dist/auth";

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

// Login User / JWT Response
const authLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: AuthLoginReqBody = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: reqBody.email,
      },
      select: {
        id: true,
        password: true,
        resetPasswordToken: true,
        resetPasswordTokenExpires: true,
      },
    });

    // Res with error if no user or passwords don't match
    if (!user || !(await bcrypt.compare(reqBody.password, user.password))) {
      const errorMessage = "Email and/or password are incorrect.";
      req.errors.email = errorMessage;
      req.errors.password = errorMessage;
      throw new AppError({
        errors: req.errors,
        message: "Invalid inputs!",
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    // Delete previous sessions
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    if (user.resetPasswordToken || user.resetPasswordTokenExpires) {
      // Delete password reset data if present
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          resetPasswordToken: null,
          resetPasswordTokenExpires: null,
        },
      });
    }

    // Create user session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: addDays(new Date(), 1),
      },
    });

    // Encode session into jwt
    const jwt = await jsonwebtoken.sign(
      { id: session.id, expires: session.expires },
      process.env.JWT_SECRET || "",
      { expiresIn: "1d" }
    );

    // Respond
    new AppResponse({
      data: { jwt },
      message: "Login successful!",
      res,
      statusCode: HttpStatusCode.OK,
    }).respond();
    return;
  }
);

// Register user
const authRegister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: AuthRegisterReqBody = req.body;

    // Check if email is taken
    const emailCheck = await prisma.user.findUnique({
      where: { email: reqBody.email },
    });

    if (emailCheck) req.errors.email = "Email in use";

    // Check if username is taken
    const usernameCheck = await prisma.user.findUnique({
      where: { username: reqBody.username },
    });

    if (usernameCheck) req.errors.username = "Username in use";

    // If any bad request errors, send response
    if (Object.keys(req.errors).length) {
      throw new AppError({
        errors: req.errors,
        message: `Duplicate field value(s)`,
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: reqBody,
    });

    // Respond
    new AppResponse({
      data: newUser,
      message: "Registration successful",
      res,
      statusCode: HttpStatusCode.CREATED,
    }).respond();
    return;
  }
);

// Send email with a reset password token
const authSendResetPasswordToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: AuthSendResetPasswordTokenReqBody = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: reqBody.email,
      },
    });

    if (!user) {
      req.errors.email = "No user found with email!";
      throw new AppError({
        errors: req.errors,
        message: "User not found!",
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    // Create reset password token and expiration
    const token = randomBytes(32).toString("hex");
    const tokenHashed = createHash("sha256").update(token).digest("hex");
    const resetPasswordTokenExpires = addMinutes(new Date(), 10);

    // Add information to user document
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordToken: tokenHashed,
        resetPasswordTokenExpires,
      },
    });

    try {
      // Send an email with a link to a form to reset the user's password
      const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/?token=${tokenHashed}`;
      await sendResetPasswordTokenEmail({
        to: user.email,
        url: resetPasswordUrl,
      });

      // Respond
      new AppResponse({
        message: "Reset password email sent!",
        res,
        statusCode: HttpStatusCode.OK,
      }).respond();
      return;
    } catch (err) {
      // In case of an error, reset the fields in the user document
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          resetPasswordToken: null,
          resetPasswordTokenExpires: null,
        },
      });

      // Respond
      throw new AppError({
        message:
          "There was a problem sending the email, please try again later!",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
);

// Resets user password with token
const authResetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: AuthResetPasswordReqBody = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: req.params.token,
      },
      select: {
        id: true,
        resetPasswordToken: true,
        resetPasswordTokenExpires: true,
      },
    });

    // Check if user with token exists or token has expired
    if (
      !user ||
      (user?.resetPasswordTokenExpires &&
        new Date() > user?.resetPasswordTokenExpires)
    ) {
      throw new AppError({
        message: "Token is invalid or expired.",
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }

    // If token is valid and not expired, set the new password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: reqBody.password,
        resetPasswordToken: null,
        resetPasswordTokenExpires: null,
        passwordUpdatedAt: new Date(),
      },
    });

    // Respond
    new AppResponse({
      message: "Password reset!",
      res,
      statusCode: HttpStatusCode.OK,
    }).respond();
    return;
  }
);

// Updates user password
const authUpdatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: AuthUpdatePasswordReqBody = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        id: req.currentUser?.id,
      },
      omit: { password: false },
    });

    // Check if currentPassword input matches real password
    if (
      !(await bcrypt.compare(reqBody.currentPassword, user?.password || ""))
    ) {
      req.errors.currentPassword = "Current password is incorrect";
      throw new AppError({
        errors: req.errors,
        message: "Unauthorized request!",
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }

    // If passwords match
    await prisma.user.update({
      where: {
        id: req.currentUser?.id,
      },
      data: {
        password: reqBody.newPassword,
        passwordUpdatedAt: new Date(),
      },
    });

    // Respond
    new AppResponse({
      message: "Password updated!",
      res,
      statusCode: HttpStatusCode.OK,
    }).respond();
    return;
  }
);

// Session
const authCreateSession = crudFactory.createRecord(prisma.session);
const authReadSession = crudFactory.readRecord(prisma.session);
const authReadAllSessions = crudFactory.readAllRecords(prisma.session);
const authUpdateSession = crudFactory.updateRecord(prisma.session);
const authDeleteSession = crudFactory.deleteRecord(prisma.session);

export const authController = {
  authTest,
  authRegister,
  authLogin,
  authSendResetPasswordToken,
  authResetPassword,
  authUpdatePassword,
  authCreateSession,
  authReadSession,
  authReadAllSessions,
  authUpdateSession,
  authDeleteSession,
};
