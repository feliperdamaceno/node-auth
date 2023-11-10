import bcrypt from 'bcrypt'

// Models
import { UserModel } from '../models'

// Schema
import { userSchema, partialUserSchema } from '../schema'

// Types
import type { Request, Response } from 'express'
import type { User } from '../@types'

const createUser = async (request: Request, response: Response) => {
  const user = request.body as User
  const { error } = userSchema.validate(user)

  try {
    if (error) throw Error(error.message)

    const users = await UserModel.find({ email: user.email })
    if (users.length > 0) throw Error('User already exist on the database.')

    const hashedPassword = await bcrypt.hash(user.password, 10)
    const record = await UserModel.create({ ...user, password: hashedPassword })

    response.status(201).send({
      timestamp: Date.now(),
      message: 'User created successfully.',
      code: '200 OK',
      data: {
        username: record.username,
        email: record.email
      }
    })
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return response.status(400).send({
        timestamp: Date.now(),
        message: error.message,
        code: '400 Bad Request'
      })
    }

    response.status(500).send({
      timestamp: Date.now(),
      message: 'Internal server error. Please try again later.',
      code: '500 Internal Server Error'
    })
  }
}

const getUsers = async (_: Request, response: Response) => {
  const users = await UserModel.find()
  const output = users.map(({ username, email }) => ({ username, email }))
  response.send({
    timestamp: Date.now(),
    message: 'Operation successful.',
    code: '200 OK',
    data: output
  })
}

const getOneUser = async (request: Request, response: Response) => {
  const { username } = request.params as { username: string }

  try {
    const user = await UserModel.find({ username })
    if (user.length === 0) throw Error('User not found.')

    const output = user.map(({ username, email }) => ({ username, email }))
    response.send({
      timestamp: Date.now(),
      message: 'Operation successful.',
      code: '200 OK',
      data: output
    })
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return response.status(404).send({
        timestamp: Date.now(),
        message: error.message,
        code: '404 Not Found'
      })
    }

    response.status(500).send({
      timestamp: Date.now(),
      message: 'Internal server error. Please try again later.',
      code: '500 Internal Server Error'
    })
  }
}

const updateUser = async (request: Request, response: Response) => {
  const { username } = request.params as { username: string }
  const user = request.body as User

  try {
    if (!username) throw Error('Invalid request. Missing username.')

    if (user.username) throw Error('Username cannot be changed.')

    if (user.email) {
      const { error } = partialUserSchema('email').validate(user.email)
      if (error) throw Error(error.message)
    }

    if (user.password) {
      const { error } = partialUserSchema('password').validate(user.password)
      if (error) throw Error(error.message)

      const hashedPassword = await bcrypt.hash(user.password, 10)
      user.password = hashedPassword
    }

    await UserModel.updateOne({ username: username }, user)

    response.status(200).send({
      timestamp: Date.now(),
      message: 'User updated successfully.',
      code: '200 OK'
    })
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return response.status(400).send({
        timestamp: Date.now(),
        message: error.message,
        code: '400 Bad Request'
      })
    }

    response.status(500).send({
      timestamp: Date.now(),
      message: 'Internal server error. Please try again later.',
      code: '500 Internal Server Error'
    })
  }
}

const deleteUser = async (request: Request, response: Response) => {
  const { username } = request.params as { username: string }

  try {
    const user = await UserModel.deleteOne({ username })
    if (user.deletedCount === 0) throw Error('User not found.')

    response.send({
      timestamp: Date.now(),
      message: 'Operation successful.',
      code: '200 OK'
    })
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return response.status(404).send({
        timestamp: Date.now(),
        message: error.message,
        code: '404 Not Found'
      })
    }

    response.status(500).send({
      timestamp: Date.now(),
      message: 'Internal server error. Please try again later.',
      code: '500 Internal Server Error'
    })
  }
}

export default {
  createUser,
  getOneUser,
  getUsers,
  updateUser,
  deleteUser
}
