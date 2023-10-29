const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { func } = require('joi')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        minlength:3,
        maxlength:50,
    },
    email: {
        type: String,
        required: [true, 'Please provide Email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        minlength:3,
       
    }
})

//hashing password using pre() hook
UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
//generate token
UserSchema.methods.generateToken = function(){
    return jwt.sign({ userId: this._id ,name: this.username }, process.env.SECRET_KEY, { expiresIn: '30d' })
}
//compare password
UserSchema.methods.comparePassword = async function(inputPassword){
    const isMatch = await bcrypt.compare(inputPassword, this.password)
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);