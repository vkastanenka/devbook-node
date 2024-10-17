import { Request, Response, NextFunction } from 'express'

// catchAsync https://medium.com/@santoshgiri2345/simplifying-error-handling-in-express-js-with-catchasync-8a0a561ada8f
export const catchAsync = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => next(err))
  }
}
