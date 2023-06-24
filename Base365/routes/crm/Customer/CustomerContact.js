const router = require("express").Router()
const controller = require("../../../controllers/crm/Customer/CustomerContact")
const formData = require("express-form-data")




//thêmm lien he
router.post("/add",formData.parse(), controller.addContact)
//sua lien he
router.post("/edit",formData.parse(), controller.editContact)
//xoa lien he
router.post("/delete",formData.parse(), controller.deleteContact)
//lay danh sach lien he
router.post("/get",formData.parse(), controller.getContact)



module.exports = router