// utils
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import { AppError } from './error-handling/app-error'
import { globalErrorHandler } from './error-handling/global-error-handler'

// routes
import { authRouter } from './routes/auth-routes'
import { userRouter } from './routes/user-routes'

// Set up env variables
dotenv.config()

// Create app
const app = express()

//////////////
// Middleware

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Implementing CORS
app.use(cors())
app.options('*', cors())

// Setting security headers
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

// Implementing rate limiting: 500 requests every hour
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})

// Will now have X-RateLimit-Limit and X-RateLimit-Remaining headers
app.use('/api', limiter)

// Body parser, reading data from req.body
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Preventing HTTP parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
)

// Compression of text sent to clients.
app.use(compression())

// Add request time to middleware for testing
app.use((req, res, next) => {
  req.requestTime = new Date()
  next()
})

// Apply routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)

// Handling unknown routes
app.all('*', (req, res, next) => {
  next(
    new AppError({
      message: `Can't find ${req.originalUrl} on this server!`,
      statusCode: 404,
    })
  )
})

// Global error handling
app.use(globalErrorHandler);

export default app
