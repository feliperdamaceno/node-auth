import express from 'express'

import { usersController } from '../controllers'

const router = express.Router()

router.get('/', usersController.getUsers)
router.post('/:username', usersController.updateUser)
router.post('/signup', usersController.createUser)

export default router
