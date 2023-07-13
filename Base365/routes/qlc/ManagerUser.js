const router = require('express').Router();
const managerUserController = require('../../controllers/qlc/ManageUser');
const formData = require('express-form-data')
const functions = require("../../services/functions")



//API lấy danh sách nhân viên
router.post("/list", formData.parse(),functions.checkToken, managerUserController.getlistAdmin);

//API tạo mới một User
router.post("/create", formData.parse(),functions.checkToken,  managerUserController.createUser);

//API thay dổi thông tin của một user
router.post("/edit", formData.parse(),functions.checkToken,  managerUserController.editUser);

//API xóa một user theo id
router.delete("/del", formData.parse(),functions.checkToken,  managerUserController.deleteUser);

// API xóa toàn bộ nv hiện có cua cty
router.delete("/delAllUser",functions.checkToken,  managerUserController.deleteCompanyALlUser);

module.exports = router