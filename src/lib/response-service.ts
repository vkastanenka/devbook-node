const statusCodes = {
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500,
  serviceUnavailable: 503,
}

const createResponse = (data: {
  message: string
  success: boolean
  status: number
  data?: any
  errors?: { [key: string]: string }
}) => {
  return { ...data }
}

const ok = (data: { message: string; data?: any }) => {
  return createResponse({
    success: true,
    status: statusCodes.ok,
    ...data,
  })
}

const created = (data: { message: string; data: any }) => {
  return createResponse({
    success: true,
    status: statusCodes.created,
    ...data,
  })
}

const noContent = (data: { message: string }) => {
  return createResponse({
    success: true,
    status: statusCodes.noContent,
    ...data,
  })
}

const badRequest = (data: { errors: { [key: string | number]: string } }) => {
  return createResponse({
    success: false,
    status: statusCodes.badRequest,
    message: 'Bad request!',
    ...data,
  })
}

const unauthorized = (data: { message: string }) => {
  return createResponse({
    success: false,
    status: statusCodes.unauthorized,
    ...data,
  })
}

const forbidden = () => {
  return createResponse({
    success: false,
    status: statusCodes.forbidden,
    message: 'You do not have permission to perform this action!',
  })
}

const notFound = (data: {
  message: string
  errors?: { [key: string | number]: string }
}) => {
  return createResponse({
    success: false,
    status: statusCodes.notFound,
    ...data,
  })
}

const internalServerError = (data?: { message?: string }) => {
  return createResponse({
    success: false,
    status: statusCodes.internalServerError,
    message: data?.message || 'Internal server error!',
  })
}

const serviceUnavailable = () => {
  return createResponse({
    success: false,
    status: statusCodes.serviceUnavailable,
    message: 'Service unavailable!',
  })
}

export const responseService = {
  statusCodes,
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  internalServerError,
  serviceUnavailable,
}
