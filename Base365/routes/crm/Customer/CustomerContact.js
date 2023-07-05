const router = require("express").Router()
const controller = require("../../../controllers/crm/Customer/CustomerContact")
const formData = require("express-form-data")
const functions= require ("../../../services/functions")




//thêmm lien hệ
router.post("/add",functions.checkToken,formData.parse(), controller.addContact)
//sua lien he
router.post("/edit",functions.checkToken,formData.parse(), controller.editContact)
//xoa lien he
router.post("/delete",functions.checkToken,formData.parse(), controller.deleteContact)
//lay danh sach lien he




module.exports = router