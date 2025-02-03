// types
import { HttpStatusCode } from '@vkastanenka/devbook-types/dist'
import { Response } from 'express'

// AppResponse object for providing meaningful responses
export class AppResponse {
  data?: any
  message: string
  res: Response
  status: 'success'
  statusCode: HttpStatusCode
  success: true

  constructor({
    data,
    message,
    res,
    statusCode,
  }: {
    data?: any
    message: string
    res: Response
    statusCode: number
  }) {
    this.data = data
    this.message = message
    this.res = res
    this.status = 'success'
    this.statusCode = statusCode
    this.success = true
  }

  respond() {
    this.res.status(this.statusCode).json({
      data: this.data,
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
      success: this.success,
    })
  }
}
