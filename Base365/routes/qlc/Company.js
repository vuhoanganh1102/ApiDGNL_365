const router = require('express').Router()
const registerComController = require('../../controllers/qlc/Company.js')

//Đăng kí tài khoản công ty 
router.post('/registerCom', registerComController.createAccCom)
















module,exports  = router