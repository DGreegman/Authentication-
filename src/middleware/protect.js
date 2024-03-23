const CustomError = require("../errors/CustomError")
const jwt = require('jsonwebtoken')
const util = require('util')
const User = require('../models/userModel')

const protect = async(req, res, next) => {
    // Read the token to know if it exists
    const testToken = req.headers.authorization || req.headers.Authorization

    let token 
    if (testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1]
    }
    if (!token) {
        next(new CustomError('Sorry but it seems like you are not Logged in, Kindly Log in and Try again...', 401))
    }
    // console.log(token)

    // validate the token 
    const decoded = await util.promisify(jwt.verify)(token, process.env.SECRET_STR)
    // console.log(decoded)
    
    // check if the user exist using the ID
    const user = await User.findById(decoded.id)
    if (!user) {
        next(new CustomError('Sorry but it seems like the user with the given token does not exist...', 401))
    }
    // attach the user to the job routes
    req.user = user
    next()
    
}

// user permission based on user role

const restrict = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            next(new CustomError('Sorry but you do not have permission to perform this action...', 403))
        }
        next()
    }
}

module.exports = {
    protect, restrict
}