import jtw from 'jsonwebtoken'

// Constants
import { SESSION_COOKIE } from '../constants'

// Models
import { UserModel } from '../models'

// Types
import type { Request, Response, NextFunction } from 'express'
import type { JwtPayload } from 'jsonwebtoken'

export default async function validateAuthUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.path.includes('login') || request.path.includes('signup')) {
    return next()
  }

  try {
    const sessionToken = request.cookies[SESSION_COOKIE.NAME]

    const decodedToken = jtw.verify(
      sessionToken,
      process.env.JTW_SECRET!
    ) as JwtPayload

    const user = await UserModel.find({ email: decodedToken.email })
    const isCookieNotExpired = new Date(decodedToken.exp!) < new Date()

    const isAuthorized =
      user.length && sessionToken && decodedToken && isCookieNotExpired

    if (isAuthorized) return next()

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
