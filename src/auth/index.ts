import jtw from 'jsonwebtoken'

// Constants
import { SESSION_COOKIE } from '../constants'

// Models
import { UserModel } from '../models'

// Types
import type { Request } from 'express'
import type { JwtPayload } from 'jsonwebtoken'

export function defineSessionExpiringDate(daysToExpire: number) {
  const now = new Date()
  return new Date(now.setDate(now.getDate() + daysToExpire))
}

export function isPublicRoute(path: string) {
  const publicRoutes = /\/(login|signup)/
  return publicRoutes.test(path)
}

export function createWebToken(email: string, daysToExpire: number) {
  return jtw.sign({ email }, process.env.JTW_SECRET!, {
    algorithm: 'HS256',
    expiresIn: `${daysToExpire}d`
  })
}

export async function isUserAuthorized(request: Request) {
  const JTW_SECRET = process.env.JTW_SECRET
  const sessionToken = request.cookies[SESSION_COOKIE.NAME]

  if (!JTW_SECRET || !sessionToken) return false

  try {
    const { email, exp } = jtw.verify(sessionToken, JTW_SECRET) as JwtPayload
    if (!email || !exp) return false

    const isTokenExpired = exp * 1000 < Date.now()
    if (isTokenExpired) return false

    const user = await UserModel.find({ email })
    return !!user.length
  } catch (_) {
    return false
  }
}
