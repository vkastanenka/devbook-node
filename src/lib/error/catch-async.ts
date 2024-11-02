// types
import { Request, Response, NextFunction } from 'express'

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
