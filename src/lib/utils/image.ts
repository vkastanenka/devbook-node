// utils
import dotenv from 'dotenv'
import sharp from 'sharp'
import multer from 'multer'
import { catchAsync } from '../error/catch-async'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// types
import { Request } from 'express'
import { AppError } from '../error/app-error'
import { HttpStatusCode } from '@vkastanenka/devbook-types'

dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME || ''
const region = process.env.AWS_BUCKET_REGION || ''
const accessKeyId = process.env.AWS_ACCESS_KEY || ''
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || ''

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
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
      ACL: 'public-read' as ObjectCannedACL,
    }

    // Store the image in S3
    await s3Client.send(new PutObjectCommand(params))

    // Get url and assign so can be stored in user table
    const url = await getObjectSignedUrl(req.file.filename)

    req.file.destination = url.split('?')[0]
  } catch (err) {
    throw new AppError({
      errors: err as { [key: string]: string },
      message: 'Unable to upload image!',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    })
  }

  next()
})

export async function getObjectSignedUrl(key: string) {
  const params = {
    Bucket: bucketName,
    Key: key,
  }

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params)
  const seconds = 60
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds })

  return url
}
