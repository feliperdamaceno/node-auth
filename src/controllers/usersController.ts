import type { Request, Response } from 'express'
import { User } from '../models'
// import bcrypt from 'bcrypt'

const getUsers = async (_: Request, response: Response) => {
  const users = await User.find()
  response.send({
    timestamp: Date.now(),
    data: users || []
  })
}

export default {
  getUsers
}
