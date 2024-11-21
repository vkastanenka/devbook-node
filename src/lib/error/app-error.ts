// types
import { HttpStatusCode } from '@vkastanenka/devbook-types/dist'

// AppError object for providing meaningful errors
export class AppError extends Error {
  errors?: { [key: string]: string }
  isOperationalError: boolean
  message: string
  status: 'fail' | 'error'
  statusCode: HttpStatusCode
  success: false

  constructor({
    errors,
    message,
    statusCode,
  }: {
    errors?: { [key: string]: string }
    message: string
    statusCode: number
  }) {
    super(message)

    this.errors = errors
    this.isOperationalError = true
    this.message = message
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.statusCode = statusCode
    this.success = false

    Error.captureStackTrace(this, this.constructor)
  }
}
