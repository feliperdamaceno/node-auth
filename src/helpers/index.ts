import jtw from 'jsonwebtoken'

// Types
import { User, ResponseUser } from '../@types'

export function createResponseUser(
  users: User[]
): ResponseUser[] | ResponseUser {
  const output = users.map(({ username, email }) => ({ username, email }))
  return output.length > 1 ? output : output[0]
}

export function createWebToken(email: string, daysToExpire: number) {
  return jtw.sign({ email }, process.env.JTW_SECRET!, {
    algorithm: 'HS256',
    expiresIn: `${daysToExpire}d`
  })
}

export function defineSessionExpiringDate(daysToExpire: number) {
  const now = new Date()
  return new Date(now.setDate(now.getDate() + daysToExpire))
}
