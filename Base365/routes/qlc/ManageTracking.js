const router = require('express').Router();
const ManageTrackingController = require('../../controllers/qlc/ManageTracking')
const functions= require ("../../services/functions")

//tìm list cấu hình chấm công cty sử dụng 
router.get ("/",functions.checkToken, ManageTrackingController.getlistTracking);



// router.post('/', ManageTrackingController.createListTracking);



// router.post('/',ManageTrackingController.editTracking );


// router.delete('/',ManageTrackingController.deleteTracking);

module.exports = router