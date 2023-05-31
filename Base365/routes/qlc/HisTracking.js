const router = require('express').Router();
const HisTrackingController = require('../../controllers/qlc/HisTracking');


// lịch sử chấm công được ghi lại 
router.post('/',HisTrackingController.CreateTracking)




module.exports = router