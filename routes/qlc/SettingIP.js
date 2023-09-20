const router = require('express').Router();
const controller = require('../../controllers/qlc/SettingIP')
const formData = require('express-form-data')
const functions = require("../../services/functions")


router.post("/get", formData.parse(), functions.checkToken, controller.getListByID)

router.post("/create", functions.checkToken, controller.createIP)

router.post("/edit", formData.parse(), functions.checkToken, controller.editsettingIP)

router.delete("/delete", formData.parse(), functions.checkToken, controller.deleteSetIpByID)

module.exports = router