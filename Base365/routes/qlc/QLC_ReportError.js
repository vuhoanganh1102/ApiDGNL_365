const router = require("express").Router()
const controller = require("../../controllers/qlc/QLC_ReportError")
const formData = require("express-form-data")
const functions= require ("../../services/functions")

//báo lỗi

router.post("/",formData.parse(), controller.create)

module.exports = router