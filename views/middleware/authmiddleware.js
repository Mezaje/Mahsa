const jwt = require('jsonwebtoken')
const User = require('../../modules/Users')


const requireAuth = (req, res, next)=>{
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token,'mezaje',(err, decodeToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodeToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}


const requireAuthadmin = (req, res, next)=>{
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token,'admin',(err, decodeToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodeToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}

// check current user 

const logincheck = (req, res, next)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token,'mezaje',(err, decodeToken)=>{
            if(err){
                console.log(err.message)
                res.locals.user = null;
                next();
            }else{
                res.redirect('/')
                console.log(decodeToken.id)
                let user = User.findById(decodeToken.id).then((result)=>{
                    res.locals.user = result
                    console.log(result)
                })

            }
        })
    } else {
        next()
    }
}


const checkUser = (req, res, next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token,'mezaje',(err, decodeToken)=>{
            if(err){
                console.log(err.message)
                res.locals.user = null;
                next();
            }else{
                console.log(decodeToken.id)
                let user = User.findById(decodeToken.id).then((result)=>{
                    res.locals.user = result
                    console.log(result)
                    next()
                })

            }
        })
    }else{
        res.locals.user = null;
        next()
    }
}

module.exports = {requireAuth, checkUser ,requireAuthadmin,logincheck}