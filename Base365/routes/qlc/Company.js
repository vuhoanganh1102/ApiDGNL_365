const router = require('express').Router()
const CompanyController = require('../../controllers/qlc/Company.js')

//Đăng kí tài khoản công ty 
router.post('/register', CompanyController.createAccCom)
//Đăng nhập tài khoản công ty
router.post('/login',CompanyController.loginCom)















module,exports  = router