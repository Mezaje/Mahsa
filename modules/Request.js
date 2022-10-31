const mongoose = require('mongoose')

const schema = mongoose.Schema

const Request = new schema({
    subject: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    stdinfo:{
        type:Object,
        required: true
    }
},{timestamps:true})

Request.post('save',(doc,next)=>{
    console.log('New RequestBook has been saved',doc)
    res.redirect('RequestBook')
    next()
})
const RequestBook = mongoose.model('RequestBook',Request)
module.exports = RequestBook