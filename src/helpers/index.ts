import type { User } from '../@types'

const isUserValid = (user: User) => {
  return user.username && user.email && user.password
}

export { isUserValid }
