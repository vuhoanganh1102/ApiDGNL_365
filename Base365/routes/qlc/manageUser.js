

const router = require('express').Router();
const manageUserController = require('../../controllers/qlc/manageUser')
const formData = require('express-form-data')
// //API lấy tất cả dữ liệu phòng ban theo page
// router.get("/page",manageUserController.getListPageUser);

//API lấy tất cả dữ liệu phòng ban 
router.get("/",manageUserController.getListUser);

//API lấy dữ liệu một phòng ban
router.get("/:id",manageUserController.getUserById);

//API tạo mới một nhan vien
router.post("/",formData.parse(),manageUserController.createUser);

//API thay dổi thông tin của một phòng ban
router.post("/:id",formData.parse(),manageUserController.editUser);

//API xóa một phòng ban theo id
router.delete("/:id",formData.parse(),manageUserController.deleteUser);

// API xóa toàn bộ phòng ban hiện có
router.delete("/",manageUserController.deleteAllUser);

module.exports = router