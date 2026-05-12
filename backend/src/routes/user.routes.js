const express = require('express')

const { registers, login } = require('../controllers/user.controller')

const userRouter = express.Router()

userRouter.post('/register', registers)
userRouter.post('/login', login)

module.exports = userRouter