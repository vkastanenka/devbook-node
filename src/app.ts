// utils
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

// routes
import userRouter from './routes/user-routes'

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

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Compression of text sent to clients.
app.use(compression())

// Apply routes
app.use("/api/v1/users", userRouter);

export default app
