const router = require("express").Router()
const controller = require("../../../controllers/crm/Setting/AccountAPI")
const formData = require("express-form-data")

// const functions= require ("../../services/functions")



// router.post("/",formData.parse(), controller.showContract)
//thêmm cài đặt hợp đồng
router.post("/add",formData.parse(), controller.addContract)

// router.post("/delete",formData.parse(), controller.deleteContract)


module.exports = router