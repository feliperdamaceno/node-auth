import express from 'express'

import { usersController } from '../controllers'

const router = express.Router()

router.get('/', usersController.getUsers)
router.post('/login', usersController.loginUser)
router.post('/signup', usersController.createUser)

router.get('/:email', usersController.getOneUser)
router.post('/:email', usersController.updateUser)
router.delete('/:email', usersController.deleteUser)

export default router
