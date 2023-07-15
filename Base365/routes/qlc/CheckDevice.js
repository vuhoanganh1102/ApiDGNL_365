const router = require('express').Router();
const CheckDeviceController = require("../../controllers/qlc/CheckDevice");
const functions= require ("../../services/functions")
const formData = require('express-form-data')
//lấy danh sách thiết bị 

//loc danh sach theo cty 
router.post("/list",functions.checkToken,formData.parse(), CheckDeviceController.getlist);

// //loc danh sach theo cty va phong ban  
// router.get("/company/depart/all",functions.checkToken, CheckDeviceController.getALlCompanyDepartmentDevice);

// //lấy dang ki  thiết bị theo Id 
// router.get("/:id",functions.checkToken, CheckDeviceController.getDeviceById);

//tao moi yeu cau dang ki thiet bi
router.post("/create",functions.checkToken,formData.parse(), CheckDeviceController.createDevice)

//chinh sua yeu cau dang ki thiet bi
router.post("/add",functions.checkToken,formData.parse(), CheckDeviceController.add)

//xoa yeu cau cau dang ki thiet bi
router.delete("/del",functions.checkToken,formData.parse(), CheckDeviceController.deleteDevice)


module.exports = router