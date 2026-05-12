const jwt=require('jsonwebtoken')

// Use middleware for authentication:- 

const authUser= async (req,res,next)=>{
    const {token}= req.headers

    if(!token){
        return res.json({
            success:false,
            message: "No token"
        })
    }

    try {
        const token_decode= jwt.verify(token, process.env.JWT_SECRET)
        req.user = token_decode
        next()

    } catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
}

module.exports=authUser