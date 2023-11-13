import bcrypt from 'bcrypt'

// Helpers
import {
  createResponseUser,
  createWebToken,
  defineSessionExpiringDate
} from '../helpers'

// Constants
import { SESSION_COOKIE } from '../constants'

// Models
import { UserModel } from '../models'

// Schema
import { userSchema, partialUserSchema } from '../schema/userSchema'

// Types
import type { Request, Response } from 'express'
import type { User } from '../@types'

const createUser = async (request: Request, response: Response) => {
  const user = request.body as User
  const { error } = userSchema.validate(user)

  try {
    if (error) throw Error(error.message)

    const users = await UserModel.find({ email: user.email })
    if (users.length) throw Error('User already exist on the database.')

    const hashedPassword = await bcrypt.hash(user.password, 10)
    const record = await UserModel.create({ ...user, password: hashedPassword })

    response.status(201).send({
      timestamp: Date.now(),
      message: 'User created successfully.',
      code: '200 OK',
      data: createResponseUser([record])
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
  response.send({
    timestamp: Date.now(),
    message: 'Operation successful.',
    code: '200 OK',
    data: createResponseUser(users)
  })
}

const getOneUser = async (request: Request, response: Response) => {
  const { email } = request.params

  try {
    const user = await UserModel.find({ email })
    if (user.length === 0) throw Error('User not found.')

    response.send({
      timestamp: Date.now(),
      message: 'Operation successful.',
      code: '200 OK',
      data: createResponseUser(user)
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
  const { email } = request.params
  const updatedUser = request.body as Partial<User>

  const user = await UserModel.find({ email })
  if (user.length === 0) {
    return response.status(404).send({
      timestamp: Date.now(),
      message: 'User not found.',
      code: '404 Not Found'
    })
  }

  try {
    if (updatedUser.email) {
      throw Error('Email is a unique identifier and cannot be changed.')
    }

    Object.entries(updatedUser).forEach(([key, value]) => {
      const { error } = partialUserSchema(key as keyof User).validate(value)
      if (error) throw Error(error.message)
    })

    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10)
    }

    await UserModel.updateOne({ email }, updatedUser)

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
  const { email } = request.params

  try {
    const user = await UserModel.deleteOne({ email })
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

const loginUser = async (request: Request, response: Response) => {
  const { email, password } = request.body as Pick<User, 'email' | 'password'>

  try {
    const user = await UserModel.find({ email })
    if (user.length === 0) {
      return response.status(404).send({
        timestamp: Date.now(),
        message: 'User not found.',
        code: '404 Not Found'
      })
    }

    const isValid = await bcrypt.compare(password || '', user[0].password)
    if (!isValid) {
      throw Error('Unauthorized access. Please provide valid credentials.')
    }

    const sessionToken = createWebToken(email, SESSION_COOKIE.DAYS_TO_EXPIRE)

    response
      .cookie(SESSION_COOKIE.NAME, sessionToken, {
        expires: defineSessionExpiringDate(SESSION_COOKIE.DAYS_TO_EXPIRE)
      })
      .send({
        timestamp: Date.now(),
        message: `${user[0].username} logged in successfully.`,
        code: '200 OK'
      })
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return response.status(401).send({
        timestamp: Date.now(),
        message: error.message,
        code: '401 Unauthorized'
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
  deleteUser,
  loginUser
}
