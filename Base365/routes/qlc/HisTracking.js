const router = require('express').Router();
const HisTrackingController = require('../../controllers/qlc/HisTracking');
// const functions= require ("../../services/functions")
const formData = require("express-form-data")

// lịch sử chấm công được ghi lại 
router.post('/',formData.parse(),HisTrackingController.CreateTracking)




module.exports = router