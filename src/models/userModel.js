const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name' ]
    },
    email: {
        type: String,
        required: [true, 'Please Enter Your Email'],
        unique: true,
        lowercase:true,
        validate: [validator.isEmail, 'Please Enter a Valid Email']
    },
    password: {
        type: String,
        required: [true,'Please Enter Your Password'],
        minlength: 6
    },
    confirmPassword: {
        type: String,
        // required: [true,'Please Confirm Your Password'],
        // validate: {
        //     // Remember this validator only works for save() and create() method
        //     validator: function(el) {
        //         return el === this.password
        //     },
        //     message: 'Passwords are not the same'
        // }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    image: String
}, 
{ 
    timestamps: true 
})

module.exports = mongoose.model('User', userSchema)