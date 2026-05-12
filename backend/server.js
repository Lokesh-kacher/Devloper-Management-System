require('dotenv').config()
const express=require('express')
const connectDB=require('../backend/src/config/db')
const userRouter= require('../backend/src/routes/user.routes')
const cors=require('cors')

const app=express()

app.use(express.json())
app.use(cors())

//Mongodb connection
connectDB()

app.use('/api/user/auth', userRouter)
const port= process.env.PORT || 5000



app.listen(port, ()=>{
    console.log(`Server running onn port ${port}`)
})