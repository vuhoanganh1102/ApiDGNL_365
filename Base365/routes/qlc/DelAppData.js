const router = require("express").Router()
const controller = require("../../controllers/qlc/DelAppData")
const formData = require("express-form-data")

const functions= require ("../../services/functions")



//Xóa toàn bộ lịch sử chấm công
router.delete("/",formData.parse(), controller.deleteAllTRacking)

//Xóa một
// router.delete("/:id",formData.parse(), controller.deleteOne)
module.exports = router