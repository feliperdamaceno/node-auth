// import bcrypt from 'bcrypt'
import { UserModel } from '../models'

// Helpers
import { isUserValid } from '../helpers'

// Types
import type { Request, Response } from 'express'

const getUsers = async (_: Request, response: Response) => {
  const users = await UserModel.find()
  response.send({
    timestamp: Date.now(),
    data: users || []
  })
}

const createUser = async (request: Request, response: Response) => {
  try {
    const user = request.body
    if (!isUserValid(user)) throw Error('Invalid Request.')

    const users = await UserModel.find({ email: user.email })
    if (users.length > 0) throw Error('User already exist on the database.')

    const newUser = await UserModel.create(user)

    response.send({
      timestamp: Date.now(),
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
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
