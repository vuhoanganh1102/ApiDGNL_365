const router = require('express').Router();
const formData = require("express-form-data");
const controllers = require("../../controllers/crm/Nhap_lieu");

router.use('/NhapLieu', formData.parse(), controllers.nhap_lieu);
module.exports = router;