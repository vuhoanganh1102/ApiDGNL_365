var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/CapPhat")
const formData = require("express-form-data")
const functions = require('../../services/functions');
const fnc = require('../../services/QLTS/qltsService')


router.post('/create',functions.checkToken,fnc.checkRole("CP_TH",2) ,formData.parse(),controller.create)


router.post('/edit',functions.checkToken, fnc.checkRole("CP_TH",2) ,formData.parse(),controller.edit)


router.post('/delete',functions.checkToken,fnc.checkRole("CP_TH",3) ,formData.parse(),controller.delete)


router.post('/getListNV',functions.checkToken,fnc.checkRole("CP_TH",1) ,formData.parse(),controller.getListNV)

router.post('/getListDep',functions.checkToken,fnc.checkRole("CP_TH",1) ,formData.parse(),controller.getListDep)
//xác nhận bàn giao cấp phát
router.post('/updateStatus',functions.checkToken,fnc.checkRole("CP_TH",4) ,formData.parse(),controller.updateStatus)
//đồng ý cấp phát
router.post('/acceptAllocation',functions.checkToken,fnc.checkRole("CP_TH",4) ,formData.parse(),controller.acceptAllocation)

router.post('/DetailEmp',functions.checkToken,fnc.checkRole("CP_TH",1) ,formData.parse(),controller.DetailEmp)
router.post('/getListDetail',functions.checkToken,fnc.checkRole("CP_TH",1) ,formData.parse(),controller.getListDetail)

router.post('/DetailDep',functions.checkToken,fnc.checkRole("CP_TH",1) ,formData.parse(),controller.DetailDep)

router.post('/refuserAll',functions.checkToken,fnc.checkRole("CP_TH",1) ,formData.parse(),controller.refuserAll)

module.exports = router