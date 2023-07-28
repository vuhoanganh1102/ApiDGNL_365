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

router.post('/updateStatus',functions.checkToken,fnc.checkRole("CP_TH",4) ,formData.parse(),controller.updateStatus)


router.post('/getListDetail',functions.checkToken,fnc.checkRole("CP_TH",1) ,formData.parse(),controller.getListDetail)

router.post('/listDetailAllocation',functions.checkToken,fnc.checkRole("CP_TH",1) ,formData.parse(),controller.listDetailAllocation)

router.post('/refuserAll',functions.checkToken,fnc.checkRole("CP_TH",1) ,formData.parse(),controller.refuserAll)

module.exports = router