const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require("../errors")

const authenticateUser = async(req, res, next)=>{
    const authHeader = req.headers.authorization
    //check for empty or invalid headers
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('No token present')
    }
    //get token
    const token = authHeader.split(' ')[1]
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        //attach user to job routes once token verified
        req.user = { userId: decodedToken.userId, name: decodedToken.name }
        next()
    }catch(err){
        throw new UnauthenticatedError('Authentication failed')
    }
}

module.exports = authenticateUser;