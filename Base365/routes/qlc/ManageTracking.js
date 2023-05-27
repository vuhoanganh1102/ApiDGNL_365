const router = require('express').Router();
const ManageTrackingController = require('../../controllers/qlc/ManageTracking')


//tìm list cấu hình chấm công cty sử dụng 
router.get ("/", ManageTrackingController.getlistTracking);



// router.post('/', ManageTrackingController.createListTracking);



// router.post('/',ManageTrackingController.editTracking );


// router.delete('/',ManageTrackingController.deleteTracking);

module.exports = router