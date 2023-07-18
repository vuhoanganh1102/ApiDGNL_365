const router = require("express").Router()
const controller = require("../../controllers/qlc/CompanyWorkday")
const formData = require("express-form-data")
const functions = require("../../services/functions")



//Xóa toàn bộ lịch sử chấm công
router.post("/create", formData.parse(),functions.checkToken, controller.create)


module.exports = router