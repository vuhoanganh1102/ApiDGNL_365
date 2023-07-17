const router = require("express").Router()
const controller = require("../../controllers/qlc/ListFaceAndAllowFace")
const formData = require("express-form-data")

const functions = require("../../services/functions")



//lấy danh sách nhân viên cần cập nhật khuôn mặt
router.post("/list", formData.parse(),functions.checkToken, controller.getlist)
//duyệt cập nhật khuôn mặt
router.post("/add", formData.parse(),functions.checkToken, controller.add)

module.exports = router