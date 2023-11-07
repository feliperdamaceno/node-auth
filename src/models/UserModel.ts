import mongoose, { Schema } from 'mongoose'
import type { User } from '../@types'

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

export default mongoose.model<User>('User', userSchema)
