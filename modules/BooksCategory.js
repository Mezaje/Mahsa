const mongoose = require('mongoose')

const schema = mongoose.Schema

const CategorySchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
    }
})

CategorySchema.post('save',(doc,next)=>{
    console.log('New Categorys has been saved',doc)
    res.redirect('Categorys')
    next()
})

const Categorys = mongoose.model('Categorys',CategorySchema)

module.exports = Categorys