const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const CustomError = require('../errors/CustomError')


/* 
    register a user to the database
*/

// function to assign token 
const signToken = id => {
  return jwt.sign({ id}, process.env.SECRET_STR, {
    expiresIn: process.env.JWT_EXPIRE_TIME
  })
}

class Users {

   async register (req, res) {
      const { name, email, password, confirmPassword, role } = req.body
  
      if (!name || !email || !password || !confirmPassword) {
        return  res.status(400).json({ message: 'All fields are required' })
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
      const userExists = await User.findOne({ email })
      if (userExists) {
         return res.status(400).json({ message: 'User already exists' })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
     const user = await User.create({ name, email, password: hashedPassword, role })
     
     const token = signToken(user._id)
     
      if (!user) {
        return  res.status(400).json({ message: 'Invalid user data' })
      }else{
        return res.status(201).json({
          status: 'success',
          token,
          data: {
            message: `User ${name} Created Successfully....`
          }
        })
      }
  }
  
  // LOGIN USERS 
  async login(req, res, next) {
    
    const { email, password } = req.body

    if (!email || !password) {
      const error = new CustomError('Please provide email and password', 400)
      return next(error)
    }
    // check if the user with such email exists in the database

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      const error = new CustomError('Invalid credentials', 400)
      return next(error)
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const error = new CustomError('Invalid credentials', 400)
      return next(error)
    }
    const token = signToken(user._id)

    return res.status(200).json({
      status: 'success',
      token,
      data: {
        message: 'User logged in successfully'
      }
    })
    next()
  }
 async viewRegistered (req, res){
    try{
      const users = await User.find({}, '-password')
      if(users.length === 0){
        return res.status(404).json({ message: 'No users found' })
      }
       return res.status(200).json({
        length: users.length,
        message: users
      })
    }catch(err){
      return res.status(500).json({ message: err.message })
    }
}

// Delete all the users in the database
async deleteAllUsers (req, res) {
  try {
    const users = await User.deleteMany()
    return res.status(204).json({ message: 'All users deleted successfully' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Delete a user by ID
}
module.exports =  Users
    // login,
    // logout,
    // updateUser,
    // deleteUser,
    // viewRegistered,
    // viewUser,
    // viewUserById
    // viewUserByEmail
   
