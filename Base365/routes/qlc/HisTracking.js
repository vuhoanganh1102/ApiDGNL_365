const router = require('express').Router();
const HisTrackingController = require('../../controllers/qlc/HisTracking');
const functions= require ("../../services/functions")

// lịch sử chấm công được ghi lại 
router.post('/',functions.checkToken,HisTrackingController.CreateTracking)




module.exports = router