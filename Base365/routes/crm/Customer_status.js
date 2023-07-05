const router = require("express").Router();
const formData = require("express-form-data");
const controller = require("../../controllers/crm/status_customer");
const functions = require("../../services/functions");

//tao status moi 
router.post("/createCustomerStatus",functions.checkToken, formData.parse(), controller.add_status_cus);
// danh sach status
router.post('/listCustomerStatus',functions.checkToken,formData.parse(), controller.get_list_status_Cus);
// //edit status
router.post('/editCustomerStatus',functions.checkToken,formData.parse(), controller.edit_status);
//xoa trang thai khach hang 
router.post('/deleteCustomerStatus',functions.checkToken,formData.parse(), controller.delete_Status);
// chinh sua item 
router.post('/UpadateItemCustomerStatus',functions.checkToken,formData.parse(), controller.edit_item_Status);
module.exports = router;