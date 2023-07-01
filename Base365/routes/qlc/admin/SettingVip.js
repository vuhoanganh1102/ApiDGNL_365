const router = require("express").Router()
const controller = require("../../../controllers/qlc/admin/SettingVip")
const formData = require("express-form-data")
const functions= require ("../../../services/functions")

//check vip

router.post("/",formData.parse(),functions.checkToken, controller.setVip)
// router.post("/before",formData.parse(), controller.check2)

module.exports = router