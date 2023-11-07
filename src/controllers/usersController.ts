import type { Request, Response } from 'express'
import { User } from '../models'
// import bcrypt from 'bcrypt'

const isUserValid = (user: {
  username: string
  email: string
  password: string
}) => {
  return user.username && user.email && user.password
}

const getUsers = async (_: Request, response: Response) => {
  const users = await User.find()
  response.send({
    timestamp: Date.now(),
    data: users || []
  })
}

const createUser = async (request: Request, response: Response) => {
  try {
    const user = request.body
    if (!isUserValid(user)) throw Error('Invalid Request.')

    const output = await User.create(user)
    response.send({
      timestamp: Date.now(),
      data: output
    })
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return response.status(400).send({
        timestamp: Date.now(),
        message: error.message
      })
    }

    response.status(500).send({
      timestamp: Date.now(),
      message: 'Internal Server Error'
    })
  }
}

export default {
  getUsers,
  createUser
}
