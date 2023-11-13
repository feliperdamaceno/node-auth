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

  const sessionToken = request.cookies[SESSION_COOKIE.NAME]
  const decodedToken = jtw.decode(sessionToken) as JwtPayload
  const user = await UserModel.find({ email: decodedToken?.email })

  const isAuthorized =
    user.length &&
    sessionToken &&
    decodedToken &&
    new Date(decodedToken.exp!) < new Date()

  if (isAuthorized) return next()

  response.status(401).send({
    timestamp: Date.now(),
    message: 'Unauthorized access. Please login to access this resource.',
    code: '401 Unauthorized'
  })
}
