const router = require("express").Router()
const controller = require("../../../controllers/qlc/admin/Admin")
const formData = require("express-form-data")
const functions= require ("../../../services/functions")

//check vip

router.post("/vip",formData.parse(),functions.checkToken, controller.setVip)


router.post("/listCom",formData.parse(),functions.checkToken, controller.getList)


router.post("/updatePassword",formData.parse(),functions.checkToken, controller.updatePassword)

module.exports = router