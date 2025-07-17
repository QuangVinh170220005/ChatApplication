import jwt from "jsonwebtoken"
import User from './../models/User.js'


export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt
        
        if(!token){
            res.status(401).json({ message: "Unauthorized - No token provided"})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decode){
            res.status(401).json({ message: "Unauthorized - Invalid token"})
        }

        const user = await User.findById(decode.userId).select("-password")
        if(!user){
            res.status(404).json({ message: "Unauthorized - User not found"})
        }

        req.user = user
        next()

    }catch(error){
        console.error("Error in protectRoute middleware:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
