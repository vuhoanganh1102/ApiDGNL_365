const router = require("express").Router()
const controller = require("../../controllers/qlc/CompanyWorkday")
const formData = require("express-form-data")
const functions = require("../../services/functions")



//cài đặt ngày công chấm công
router.post("/create", formData.parse(),functions.checkToken, controller.create)
// lấy danh sách cài đặt ngày công chấm công 
router.post("/list", formData.parse(),functions.checkToken, controller.list)

module.exports = router