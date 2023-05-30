

const router = require('express').Router();
const manageUserController = require('../../controllers/qlc/manageUser')

//API lấy tất cả dữ liệu phòng ban theo page
router.get("/page",manageUserController.getListPageUser);

//API lấy tất cả dữ liệu phòng ban 
router.get("/",manageUserController.getListUser);

//API lấy dữ liệu một phòng ban
router.get("/:id",manageUserController.getUserById);

//API tạo mới một phUser
router.post("/",manageUserController.createUser);

//API thay dổi thông tin của một phòng ban
router.post("/:id",manageUserController.editUser);

//API xóa một phòng ban theo id
router.delete("/:id",manageUserController.deleteUser);

// API xóa toàn bộ phòng ban hiện có
router.delete("/",manageUserController.deleteAllUser);

module.exports = router