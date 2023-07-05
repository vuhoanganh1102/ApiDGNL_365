const router = require("express").Router()
const controller = require("../../../controllers/crm/Contract/formContract")
const formData = require("express-form-data")

const functions= require ("../../../services/functions")



router.post("/",functions.checkToken,formData.parse(), controller.addContract)

router.post("/edit",functions.checkToken,formData.parse(), controller.editContract)

router.delete("/delete",functions.checkToken,formData.parse(), controller.deleteContract)
router.delete("/delete/detail",functions.checkToken,formData.parse(), controller.deleteDetailContract)
module.exports = router