const router = require("express").Router()
const controller = require("../../../controllers/crm/Contract/formContract")
const formData = require("express-form-data")

// const functions= require ("../../services/functions")



router.post("/",formData.parse(), controller.addContract)

router.post("/edit",formData.parse(), controller.editContract)

router.delete("/delete",formData.parse(), controller.deleteContract)
router.delete("/delete/detail",formData.parse(), controller.deleteDetailContract)
module.exports = router