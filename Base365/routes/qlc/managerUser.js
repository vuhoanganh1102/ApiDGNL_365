

const router = require('express').Router();
const managerUserController = require('../../controllers/qlc/manageUser');
const formData = require('express-form-data')

//API lấy tất cả danh sách nhân viên 
// router.get("/",formData.parse(),managerUserController.getlistUser);

//API lấy danh sách nhân viên
router.post("/user",formData.parse(),managerUserController.getlistAdmin);

//API tạo mới một User
router.post("/",formData.parse(),managerUserController.createUser);

//API thay dổi thông tin của một user
router.post("/:id",formData.parse(),managerUserController.editUser);

//API xóa một user theo id
router.delete("/:id",formData.parse(),managerUserController.deleteUser);

// API xóa toàn bộ nv hiện có
router.delete("/",managerUserController.deleteAllUser);

module.exports = router