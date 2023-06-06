

const router = require('express').Router();
const manageUserController = require('../../controllers/qlc/manageUser')
const formData = require('express-form-data')
// //API lấy tất cả dữ liệu nhan vien theo page
// router.get("/page",manageUserController.getListPageUser);

//API lấy tất cả dữ liệu nhan vien 
router.get("/",manageUserController.getListUser);
//API lấy tất cả dữ liệu nhan vien la admin 
router.get("/",manageUserController.getlistAdmin);

//API lấy dữ liệu một nhan vien
router.get("/:id",manageUserController.getUserById);

//API tạo mới du lieu nhan vien
router.post("/",formData.parse(),manageUserController.createUser);

//API thay dổi thông tin của một nhan vien
router.post("/:id",formData.parse(),manageUserController.editUser);

//API xóa một nhan vien theo id
router.delete("/:id",formData.parse(),manageUserController.deleteUser);

// API xóa toàn bộ nhan vien hiện có
router.delete("/",manageUserController.deleteAllUser);

module.exports = router