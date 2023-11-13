// Types
import { User, ResponseUser } from '../@types'

export function createResponseUser(
  users: User[]
): ResponseUser[] | ResponseUser {
  const output = users.map(({ username, email }) => ({ username, email }))
  return output.length > 1 ? output : output[0]
}
