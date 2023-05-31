const router = require('express').Router();
const CheckDeviceController = require("../../controllers/qlc/CheckDevice");
const functions= require ("../../services/functions")

//lấy danh sách thiết bị 
router.get("/",functions.checkToken, CheckDeviceController.getAllDevice);

//loc danh sach theo cty 
router.get("/company/all",functions.checkToken, CheckDeviceController.getALlCompanyDevice);

//loc danh sach theo cty va phong ban  
router.get("/company/depart/all",functions.checkToken, CheckDeviceController.getALlCompanyDepartmentDevice);

//loc danh sach theo cty va phong ban và id  
router.get("/company/depart/:id",functions.checkToken, CheckDeviceController.getIDCompanyDepartmentDevice);

//lấy dang ki  thiết bị theo Id 
router.get("/:id",functions.checkToken, CheckDeviceController.getDeviceById);

//tao moi yeu cau dang ki thiet bi
router.post("/",functions.checkToken, CheckDeviceController.createDevice)

//chinh sua yeu cau dang ki thiet bi
router.post("/:id",functions.checkToken, CheckDeviceController.editDevice)

//xoa yeu cau cau dang ki thiet bi
router.delete("/:id",functions.checkToken, CheckDeviceController.deleteDevice)

//xoa yeu cau cau dang ki thiet bi
router.delete("/",functions.checkToken, CheckDeviceController.deleteAllDevice)

module.exports = router