export const responseService = {
  statusCodes: {
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
  },

  success(message: string, data: any) {
    return {
      success: true,
      message,
      data,
      status: this.statusCodes.ok,
    }
  },

  createdSuccess(message: string, data: any) {
    return {
      success: true,
      message,
      data,
      status: this.statusCodes.created,
    }
  },

  error(message: string, error: string) {
    return {
      success: false,
      message,
      error,
      status: this.statusCodes.badRequest,
    }
  },

  badRequestError(message: string) {
    return {
      success: false,
      message,
      error: 'Bad request',
      status: this.statusCodes.badRequest,
    }
  },

  unauthorizedError(message: string) {
    return {
      success: false,
      message,
      error: 'Unauthorized',
      status: this.statusCodes.unauthorized,
    }
  },

  forbiddenError(message: string) {
    return {
      success: false,
      message,
      error: 'Forbidden',
      status: this.statusCodes.forbidden,
    }
  },

  notFoundError(message: string) {
    return {
      success: false,
      message,
      error: 'Not found',
      status: this.statusCodes.notFound,
    }
  },

  internalServerError(message: string) {
    return {
      success: false,
      message,
      error: 'Internal server error',
      status: this.statusCodes.internalServerError,
    }
  },

  serviceUnavailableError(message: string) {
    return {
      success: false,
      message,
      error: 'Service unavailable',
      status: this.statusCodes.serviceUnavailable,
    }
  },
}
