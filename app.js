const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { GridFSBucket } = require('mongoose-gridfs')
const router = require('./Router/AppRouter')
const bodyParser = require('body-parser')
const cors = require('cors')
const methodOverride = require('method-override');
const multer = require("multer");
const {
  GridFsStorage
} = require("multer-gridfs-storage");
var crypto = require('crypto');
var path = require('path');
const Categorys = require('./modules/BooksCategory')
const {checkUser, requireAuthadmin} = require('./views/middleware/authmiddleware')
const cookie = require('cookie-parser')
const User = require('./modules/Users')
const { Request } = require('./Router/AppControl')
const RequestBook = require('./modules/Request')


// const url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'



// mongoose.connect(url,()=>{
//     app.listen(4000,()=>{
//         console.log('done')
//     })
// })

const url = 'mongodb+srv://abdo:10120219a@nodetuts.nwdmp.mongodb.net/?retryWrites=true&w=majority'



mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology:true },
  function(err,res){
    try {
      console.log('Connrcted to Database')
      app.listen(4000)
    } catch (error) {
      throw error
    }
  }
  )



app.use(methodOverride('_method'));
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.json());
app.use(cors())
app.use(cookie())
let bucket;
mongoose.connection.on("connected", () => {
  var client = mongoose.connections[0].client;
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "Books"
  });
});

const storage = new GridFsStorage({
    url: url,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = file.originalname+'_'+Date.now();
        const fileInfo = {
          filename: filename,
          bucketName: "Books",
          metadata: {name:req.body.name,category:req.body.category,overview:req.body.overview,Imgs:req.body.Imgs}
        };
        resolve(fileInfo);
      });
    }
  });
  const upload = multer({
    storage
  });


app.get('*',checkUser)
app.get('/',(req,res)=>{
    res.render('index')
})


app.get('/About',(req,res)=>{
    res.render('About')
})

app.get('/upload',requireAuthadmin,async(req,res)=>{
  Categorys.find().then((result)=>{
    res.render('cp/Upload',{cat:result})
  })
    const file =  bucket.find()
    file.forEach(doc=> console.log(doc))
})

app.post("/upload",requireAuthadmin, upload.single("file"), (req, res) => {
    res.status(200)
      .send("File uploaded successfully");
  });

  app.get('/admin',requireAuthadmin,async(req,res)=>{
    const student =await User.find()
    const Request = await RequestBook.find()
    console.log(student)
    bucket.find().toArray((err,files)=>{
      res.render('cp/IndexAdmin',{book:files,std:student,Request})
  })
})


app.use(router)

app.use((req,res)=>{
  res.status(404).send('404')
})