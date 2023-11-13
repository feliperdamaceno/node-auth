// Constants
import { SESSION_COOKIE } from '../constants'

// Types
import type { Request, Response, NextFunction } from 'express'

export default function validateAuthUser(
  request: Request,
  _: Response,
  next: NextFunction
) {
  const sessionToken = request.cookies[SESSION_COOKIE.NAME]
  console.log(sessionToken)
  next()
}
