// Auth
import { isPublicRoute, isUserAuthorized } from '../auth'

// Types
import type { Request, Response, NextFunction } from 'express'

export default async function validateAuthUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    if (isPublicRoute(request.path)) return next()
    if (await isUserAuthorized(request)) return next()

    throw Error('Unauthorized access. Please login to access this resource.')
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return response.status(403).send({
        timestamp: Date.now(),
        message: error.message,
        code: '403 Forbidden'
      })
    }

    response.status(500).send({
      timestamp: Date.now(),
      message: 'Internal server error. Please try again later.',
      code: '500 Internal Server Error'
    })
  }
}
