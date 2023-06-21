const router = require("express").Router()
const controller = require("../../../controllers/crm/Contract/formContract")
const formData = require("express-form-data")

// const functions= require ("../../services/functions")



router.post("/",formData.parse(), controller.addContract)

router.post("/edit",formData.parse(), controller.editContract)

module.exports = router