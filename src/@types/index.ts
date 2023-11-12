import type { Document } from 'mongoose'

export interface User extends Document {
  username: string
  email: string
  password: string
}

export type ResponseUser = Pick<User, 'username' | 'email'>
