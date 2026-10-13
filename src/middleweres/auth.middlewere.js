import { GEO_REPLY_WITH } from "redis"

export const authMiddlewere = async (req, res, next) =>{
    const authHeader = req.headers.authorization
    console.log('authHeader::::::::::',authHeader)
    const token = authHeader.split(" ")[1]
    console.log(token)
    if(token){
        req.headers.authorization = `Bearer ${token}`
    }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded

    next()
}