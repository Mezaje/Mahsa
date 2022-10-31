const mongoose = require('mongoose')
const { isEmail } = require('validator')
const crypto = require('crypto-js')

const schema = mongoose.Schema

const user = new schema({
    email: {
        type: String,
        minlength:[6,'its shoud be more than 6 word'],
        required: true,
        unique: true,
        lowercase:true,
        validate: [isEmail,'please enter avalid email']
    },
    name:{
        type: String,
        minlength:[4,'enter more word'],
        unique:true,
        required:true,
    },
    password:{
        type: String,
        minlength:[6,'its shoud be more than 6 word'],
        required: true

    },
    isadmin:{
        require: true,
        type : Boolean,
        default:false
    }
})

user.pre('save',async function(next){
    this.password = await crypto.AES.encrypt(this.password,'mezaje').toString()
    console.log(this.password)
    next()
})


user.statics.login = async function(email,password){
    const user = await this.findOne({ email })
    if(user){
        const thepass = crypto.AES.decrypt(user.password,'mezaje').toString(crypto.enc.Utf8)
        console.log(thepass)
        if(password === thepass){
            this.status = true
            return user
        }throw Error('inncorect password')
    }
    throw Error('inncorect email')
}

user.post('save',(doc,next)=>{
    console.log('new user has been saved',doc)
    next()
})



const User = mongoose.model('theusers',user)

module.exports = User