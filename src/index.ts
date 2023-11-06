import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import { users } from './routes'

dotenv.config()
mongoose.connect(process.env.DATABASE_URL!)

// Server setup
const PORT = 3000
const app = express()
app.listen(PORT, () => console.log(`Server listening on http://localhost:3000`))

// Middlewares
app.use(express.json()).use(cors())

// Routes
app.get('/', (_, response) =>
  response.send({ timestamp: Date.now(), message: 'Server Working' })
)

app.use('/users', users)
