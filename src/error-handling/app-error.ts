export class AppError extends Error {
  errors?: { [key: string]: string }
  isOperationalError: boolean
  message: string
  status: 'fail' | 'error'
  statusCode: number

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
    
    Error.captureStackTrace(this, this.constructor)
  }
}
