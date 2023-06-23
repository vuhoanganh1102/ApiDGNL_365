const router = require("express").Router();
const formData = require("express-form-data");
const controllers = require("../../../controllers/crm/Customer/Customer_Chance");
// danh sach co hoi
router.post('/listChance', formData.parse(), controllers.listChance);
//tao moi co hoi
router.post('/createChange', formData.parse(), controllers.create_Chance);
//update co hoi
router.post('/updateCustomerChance', formData.parse(), controllers.update_chance);
//delete co hoi 
router.post('/deleteChance', formData.parse(), controllers.deleteChange);
//chia se co hoi
router.post('/shareChance', formData.parse(), controllers.shareChance);
module.exports = router;