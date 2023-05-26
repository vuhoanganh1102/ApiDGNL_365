

const router = require('express').Router();
const managerUserController = require('../../controllers/qlc/managerUser')

//API lấy tất cả dữ liệu phòng ban 
router.get("/",managerUserController.getListUser);

//API lấy dữ liệu một phòng ban
router.get("/:id",managerUserController.getUserById);

//API tạo mới một phUser
router.post("/",managerUserController.createEmployee);

//create tk nhan vien
router.post("/nhanvien/create",managerUserController.createEmployee);
//create tk ca nhan
router.post("/canhan/create",managerUserController.createIndividual);

//API thay dổi thông tin của một phòng ban
router.post("/:id",managerUserController.editUser);

//API thay doi thong tin nhan vien
router.post("/nhanvien/edit",managerUserController.editEmployee);

//API thay doi thong tin ca nhan
router.post("/canhan/edit",managerUserController.editIndividual);

//API xóa một phòng ban theo id
router.delete("/:id",managerUserController.deleteUser);

// API xóa toàn bộ phòng ban hiện có
router.delete("/",managerUserController.deleteAllUser);

module.exports = router