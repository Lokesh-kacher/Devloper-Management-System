require('dotenv').config()
const app=require('../backend/src/app')
const connectDB=require('../backend/src/config/db')

connectDB()

const port= process.env.PORT || 5000

app.listen(port, ()=>{
    console.log(`Server running onn port ${port}`)
})