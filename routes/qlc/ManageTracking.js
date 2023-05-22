const router = require('express').Router();
const ManageTrackingController = require('../../controllers/qlc/ManageTracking')


router.get ("/", ManageTrackingController.getlistTracking);



// router.post('/', ManageTrackingController.createListTracking);



router.post('/',ManageTrackingController.editTracking );


// router.delete('/',ManageTrackingController.deleteTracking);

module.exports = router