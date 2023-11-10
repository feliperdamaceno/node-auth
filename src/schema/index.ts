import Joi from 'joi'

// Types
import type { User } from '../@types'

export const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().min(8).email().required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'
      )
    )
    .required()
})

export const partialUserSchema = (key: keyof User) => userSchema.extract(key)
