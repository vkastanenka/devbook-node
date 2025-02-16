// utils
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { AppError } from "./lib/error/app-error";
import { globalErrorHandler } from "./lib/error/global-error-handler";

// routes
import { addressRouter } from "./routes/address-routes";
import { authRouter } from "./routes/auth-routes";
import { searchRouter } from "./routes/search-routes";
import { postRouter } from "./routes/post-routes";
import { userRouter } from "./routes/user-routes";

// types
import { HttpStatusCode } from "@vkastanenka/devbook-types/dist";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//////////////
// Middleware

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Implementing CORS
app.use(cors());
app.options("*", cors());

// Setting security headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Implementing rate limiting: 2000 requests every hour
const limiter = rateLimit({
  max: 2000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// Will now have X-RateLimit-Limit and X-RateLimit-Remaining headers
app.use("/api", limiter);

// Body parser, reading data from req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Preventing HTTP parameter pollution
app.use(
  hpp({
    whitelist: ["skip", "take"],
  })
);

// Catch favicon requests from browser
app.get("/favicon.ico", (req: Request, res: Response) => {
  res.status(204);
});

// Compression of text sent to clients.
app.use(compression());

// Add request time to middleware for testing
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

// Add errors object for easier handling
app.use((req, res, next) => {
  req.errors = {};
  next();
});

///////////
// Routing

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Welcome to the Devbook API!", status: "Success!" });
});

// Use routes
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

//////////////////
// Error Handling

// Handling unknown routes
app.all("*", (req, res, next) => {
  next(
    new AppError({
      message: `Can't find ${req.originalUrl} on this server!`,
      statusCode: HttpStatusCode.NOT_FOUND,
    })
  );
});

// Global error handling
app.use(globalErrorHandler);

/////////////////
// Launch Server

const server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

///////////////////////////////////
// Exception and Rejection Handling

// Uncaught exception handling
process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down!");
  console.log(err.name, err.message);
  process.exit(1);
});

// Unhandled rejection handling
process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down!");
  server.close(() => {
    process.exit(1);
  });
});
