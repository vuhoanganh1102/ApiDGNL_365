const router = require("express").Router()
const controller = require("../../controllers/qlc/homePage")
const formData = require("express-form-data")




//Xóa toàn bộ lịch sử chấm công
router.post("/",formData.parse(), controller.getlistUserNoneSetCarlendar)

//Xóa một
// router.delete("/:id",formData.parse(), controller.deleteOne)
module.exports = router