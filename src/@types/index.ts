import type { Document } from 'mongoose'

export interface User extends Document {
  username: string
  email: string
  password: string
}

export interface Session extends Document {
  username: string
  expireDate: number
}
