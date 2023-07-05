const router = require("express").Router()
const controller = require("../../../controllers/crm/Contract/ContractForCus")
const formData = require("express-form-data")

const functions= require ("../../../services/functions")



router.post("/",functions.checkToken,formData.parse(), controller.showContract)

router.post("/add",functions.checkToken,formData.parse(), controller.showDetailContract)

router.post("/delete",functions.checkToken,formData.parse(), controller.deleteContract)
module.exports = router