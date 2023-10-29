const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcryptjs')


const register = async (req, res)=>{
    const user = await User.create({...req.body});
    const token = user.generateToken()

    res.status(StatusCodes.CREATED).json({ user: user.username, token })

    
}

const login = async (req, res)=>{
    const { email, password } = req.body

    //check for empty values
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    //find user
    const user = await User.findOne({ email })
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    //compare password if match display user and generate token
    const isCorrectPassword = user.comparePassword(password)
    if(!isCorrectPassword){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.generateToken()
    res.status(StatusCodes.OK).json({ user: user.username , token })
}

module.exports = {
    register,
    login
}