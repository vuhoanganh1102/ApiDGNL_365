const router = require('express').Router()
const employeeController = require('../../controllers/qlc/Employee')

//đăng kí tài khoản nhân viên 
 router.post('/', employeeController.createEmpAcc)





module.exports = router