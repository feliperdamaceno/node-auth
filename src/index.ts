import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import { users } from './routes'
import { validateAuthUser } from './middlewares'

dotenv.config()

// Database Connect
mongoose.connect(process.env.MONGODB_URL!)

// Server Setup
const PORT = process.env.PORT || 3000
const app = express()

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
)

// Middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(validateAuthUser)

// Routes
app.get('/', (_, response) =>
  response.status(200).send({
    timestamp: Date.now(),
    message: 'Server Working.',
    code: '200 OK'
  })
)

app.use('/users', users)
