const express = require('express')
const Books = require('../modules/Books')
const Category = require('../modules/BooksCategory')
const User = require('../modules/Users')
const fs = require('node:fs')
const gridfs = require('mongoose-gridfs')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const RequestBook = require('../modules/Request')
const crypto = require('crypto-js')




const handellerr=(err)=>{
  console.log(err.message, err.code)
  let error = { email:'', password:'' }
  if (err.code === 11000){
      error.email= 'the email is already registered'
      return error
  }
  if (err.message === 'please enter avalid email'){
      error.email = 'this is avalid email'
  }
  if (err.message === 'its shoud be more than 6 word'){
      error.password = 'wrong password'
  }

  if (err.message.includes('theusers validation failed')){
      Object.values(err.errors).forEach(({properties})=>{
          error[properties.path] = properties.message
      })
  }

  return error;
}
const maxage= 3 * 24 * 60 * 60

// create jwt token
const createToken = (id)=>{
  return jwt.sign({id},'mezaje',{
      expiresIn:maxage
  })
}

const createTokenadmin = (id)=>{
  return jwt.sign({id},'admin',{
      expiresIn:maxage
  })
}
module.exports.logout = async (req ,res)=>{
  res.cookie('jwt','', {maxage:1})
  res.redirect('/')
  res.status(200)
}

module.exports.user_table = async (req ,res)=>{
  constproduct= User.find({isadmin:false}).then((result)=>{
      res.render('cp/tables',{users:result})
  })
  res.status(200)
}

module.exports.signup = async (req ,res)=>{
  res.render('cp/register')
  res.status(200)
}


module.exports.signup_post = async (req ,res)=>{
  const { email,password,name }= req.body
  try{
      const user= await User.create({email,name,password})
      res.status(201).json({user:user._id})
  }catch(err){
      const errors = handellerr(err)
      res.status(400).json({errors})
  }
}

module.exports.user_table_data = async (req ,res)=>{
    try {
        let result = []
        let theproducts = {}
        const Users= await User.find({isadmin:false}).then((newresult)=>{
            const mop = newresult.map((det)=>{
              const pp = crypto.AES.decrypt(det.password,'mezaje').toString(crypto.enc.Utf8)
              console.log(det)
              det.password = pp
              result.push(det)
            })
        })
        res.send({result})
    } catch (error) {
        
    }
}
module.exports.updatauser = async (req,res)=>{
  console.log(req.body)
  try {
    const pass =  await crypto.AES.encrypt(req.body.password,'mezaje').toString()
    console.log(pass,'sdfs')
      const user = await User.findOneAndUpdate({_id:req.body.id},{name:req.body.name,email:req.body.email,password:pass},{new:true})
      res.send({user})
  } catch (error) {
      
  }
}

module.exports.deleteuser = async (req,res)=>{
  console.log(req.body)
  try {
      const user = await User.findByIdAndDelete(req.body.id)
      res.send({user})
      console.log(user)
  } catch (error) {
      
  }
}



let bucket;
mongoose.connection.on("connected", () => {
  var client = mongoose.connections[0].client;
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "Books"
  });
});


module.exports.categorys =(async(req,res)=>{
  try {
    const category = await Category.find()
    res.render('cp/Category',{cat:category})
  } catch (error) {
    res.send(error)
  }
})

module.exports.categorylist =(async(req,res)=>{
  try {
    const category = await Category.find()
    res.send({cat:category})
  } catch (error) {
    res.send(error)
  }
})

module.exports.createcategory =(async(req,res)=>{
  try {
    console.log(req.body)
    const resul = await Category.create(req.body)
    console.log(resul,'kkkp')
    res.send({result:resul})
  } catch (error) {
    res.send({error:error})
  }
})

module.exports.DeleteCat =(async(req,res)=>{
  try {
    console.log(req.body)
    const resul = await Category.findByIdAndDelete({_id:req.body.id})
    console.log(resul,'kkkp')
    res.send({result:resul})
  } catch (error) {
    res.send({error:error})
  }
})

module.exports.updatecat =(async(req,res)=>{
  console.log(req.body)
  try {
    const resul = await Category.findByIdAndUpdate({_id:req.body.id},{name:req.body.name})
    console.log(resul,'kkkp')
    res.send({result:resul})
  } catch (error) {
    res.send({error:error})
  }
})



module.exports.BooksList = (async(req,res)=>{
    // const file =  bucket.find()
    // file.forEach(doc=> console.log(doc))
    bucket.find().toArray((err,files)=>{
        res.send(files)
    })
})

module.exports.Book = (async(req,res)=>{
    Category.find().then((result)=>{
        res.render('Books',{cat:result})
    })
})

module.exports.BookTable = (async(req,res)=>{
  Category.find().then((result)=>{
      res.render('cp/BooksTables',{cat:result})
  })
})

module.exports.contactus = async(req,res)=>{
  res.render('Contactus')
}

module.exports.BookDetails = (async(req,res)=>{
    const id = req.params.filename
    console.log(id)
    const element = bucket.findOne({filename:id},((err,files)=>{
        console.log(files)
        res.render('BookDetails',{files:files})
    }))
})


module.exports.updateBook = async (req,res)=>{
  console.log(req.body)
  try {
      const user = await bucket.rename({_id:req.body.id},req.body,{new:true})
      res.send({user})
      console.log(user)
  } catch (error) {
      
  }
}

module.exports.deleteBook = async (req,res)=>{
  console.log(req.body.id)
  const filename = req.body.id
  const document = await bucket.find({
    filename
  }).toArray()
  if (document.length ===0){
    throw new error('not found')
  }
  res.send({document})
  return Promise.all(document.map(doc => {
    return bucket.delete(doc._id)
  }))
}



module.exports.DownloadBook = (async(req,res)=>{
        const file = bucket
      .find({
        filename: req.params.filename
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404)
            .json({
              err: "no files exist"
            });
        }
        bucket.openDownloadStreamByName(req.params.filename)
          .pipe(res);
      });
})

// login

module.exports.login_get = (req,res)=>{
  res.render('login',{title:'Login'})
};

module.exports.login_post = async (req,res)=>{
  const {email , password} = req.body
  try {
      const user = await User.login(email,password)
      if(user.isadmin){
          const token = createTokenadmin(user._id)
          res.cookie('jwt',token,{httpOnly:true,maxAge:maxage*1000})
          res.status(200).json({users: user._id});
          console.log(user._id)
      }else{
          const token = createToken(user._id)
          res.cookie('jwt',token,{httpOnly:true,maxAge:maxage*1000})
          res.status(200).json({users: user._id});
          console.log(user._id)
      }
  } catch (err) {
      const errors = handellerr(err)
      res.status(400).json({ errors })
  }
}

module.exports.user_tablepost = async (req ,res)=>{
  const body = req.body
  console.log(body)
  res.status(200)
}



// Request Books

module.exports.Request = async (req,res)=>{
  res.render('Request')
}

module.exports.RequestPost = async (req,res)=>{
  try {
    const stdinfo = await User.findById(req.body.stdinfo)
    const reqe= RequestBook.create({name:req.body.name,subject:req.body.subject,stdinfo})
    res.send({Done:'Your Request Has been Sent We will Review Your ,And Email You Later'})
    console.log(stdinfo)
  } catch (error) {
    res.send({error:'Error Cant Request Now Try Later'})
  }

}