// utils
import AWS from 'aws-sdk'
import sharp from 'sharp'
import multer from 'multer'
import { catchAsync } from '../error/catch-async'

// types
import { Request } from 'express'
import { AppError } from '../error/app-error'
import { HttpStatusCode } from '@vkastanenka/devbook-types'

// update aws config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

// Store the file in memory as a Buffer object
const multerStorage = multer.memoryStorage()

// Test if the file is an image
const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// Configuring multer upload
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

// Uploads file to req.file
export const uploadSingleImage = upload.single('image')

export const resizeUserImage = catchAsync(async (req: Request, res, next) => {
  if (!req.file || !req.currentUser) return next()

  try {
    const s3 = new AWS.S3()

    // Need to define filename property to save to database
    req.file.filename = `user-${req.currentUser.id}-${Date.now()}.jpeg`

    // Processing the uploaded image
    const photo = await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toBuffer()

    // Set up the parameters for storing the image in S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || 's3-devbook',
      Key: req.file.filename,
      Body: photo,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    }

    // Store the image in S3
    const result = await s3.upload(params).promise()

    req.file.destination = result.Location
  } catch (err) {
    throw new AppError({
      errors: err as { [key: string]: string },
      message: 'Unable to upload image!',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    })
  }

  next()
})
