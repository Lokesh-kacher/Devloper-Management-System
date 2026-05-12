const userModel=require('../models/user.models')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authUser = require('../middleware/authUser')


// API for create user account 
const registers = async (req, res) => {
    try {
        const { username, email, password } = req.body
        // validation 
        if (!username || !email || !password) {
            return res.json({
                success: false,
                message: "Misiing details"
            })
        }

        // email validating 
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Email is not valid"
            })
        }

        // Password validate
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Make string password"
            })
        }

        // Hasing the password 
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt)

        const userData = {
            username,
            email,
            password: hashpassword
        }

        const newUser = new userModel(userData)
        await newUser.save()

        const token = jwt.sign({
            id: newUser._id,
        }, process.env.JWT_SECRET)

        res.json({
            success: true,
            token
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API for login user account
const login = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.json({
            success: false,
            message: "User not found"
        })
    }

    const ismatch = await bcrypt.compare(password, user.password)

    if (ismatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({
            success: true,
            token
        })
    } else {
        res.json({
            success: false,
            message: "Invalid creadientials"
        })
    }
}


module.exports = { registers, login}