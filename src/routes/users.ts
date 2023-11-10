import express from 'express'

import { usersController } from '../controllers'

const router = express.Router()

router.get('/', usersController.getUsers)
router.post('/signup', usersController.createUser)
router.get('/:username', usersController.getOneUser)
router.post('/:username', usersController.updateUser)
router.delete('/:username', usersController.deleteUser)

export default router
