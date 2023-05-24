const router = require('express').Router();
const CheckDeviceController = require("../../controllers/qlc/CheckDevice");


//lấy danh sách thiết bị 
router.get("/",CheckDeviceController.getAllDevice);

//loc danh sach theo cty 
router.get("/company/all",CheckDeviceController.getALlCompanyDevice);

//loc danh sach theo cty va phong ban  
router.get("/company/depart/all",CheckDeviceController.getALlCompanyDepartmentDevice);

//loc danh sach theo cty va phong ban và id  
router.get("/company/depart/:id",CheckDeviceController.getIDCompanyDepartmentDevice);

//lấy dang ki  thiết bị theo Id 
router.get("/:id",CheckDeviceController.getDeviceById);

//tao moi yeu cau dang ki thiet bi
router.post("/",CheckDeviceController.createDevice)

//chinh sua yeu cau dang ki thiet bi
router.post("/:id",CheckDeviceController.editDevice)

//xoa yeu cau cau dang ki thiet bi
router.delete("/:id",CheckDeviceController.deleteDevice)

//xoa yeu cau cau dang ki thiet bi
router.delete("/",CheckDeviceController.deleteAllDevice)

module.exports = router