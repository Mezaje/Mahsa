const { Router } = require('express')
const control = require('./AppControl')
const router = Router()
const {requireAuth,requireAuthadmin,logincheck} = require('../views/middleware/authmiddleware')

router.get('/BookList',control.BooksList)
router.get('/Book',control.Book)
router.get('/Book/:filename',requireAuth,control.BookDetails)
router.get('/Book/Download/:filename',requireAuth,control.DownloadBook)
router.get('/category',requireAuthadmin,control.categorys)
router.get('/categorylist',requireAuthadmin,control.categorylist)

router.delete('/category',requireAuthadmin,control.DeleteCat)
router.put('/category',requireAuthadmin,control.updatecat)


router.post('/category',requireAuthadmin,control.createcategory)
router.get('/tables_user',requireAuthadmin,control.user_table)
router.post('/tables_user',requireAuthadmin,control.user_tablepost)

router.get('/studentform',requireAuthadmin,control.signup)
router.get('/BooksTable',control.BookTable)
router.post('/studentform',control.signup_post)

router.get('/admindata',requireAuthadmin,control.user_table_data)


router.put('/BookTable',requireAuthadmin,control.updateBook)
router.delete('/BookTable',requireAuthadmin,control.deleteBook)

router.put('/tables_user',requireAuthadmin,control.updatauser)
router.delete('/tables_user',requireAuthadmin,control.deleteuser)

//
router.get('/login',logincheck,control.login_get)
router.post('/login',logincheck,control.login_post)
router.get('/logout',requireAuth,control.logout)

router.get('/contactUs',control.contactus)

router.get('/Request',requireAuth,control.Request)
router.post('/Request',requireAuth,control.RequestPost)


module.exports = router