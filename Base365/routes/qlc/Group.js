const router = require('express').Router();
const GroupController = require('../../controllers/qlc/Group')
const formData = require('express-form-data')
const functions = require("../../services/functions")



//Api tạo một nhóm mới
router.post("/create", formData.parse(), GroupController.createGroup);

//API thay đổi thông tin của một nhóm
router.post("/edit", formData.parse(), GroupController.editGroup);

//API Xóa một nhóm theo id
router.delete("/del", formData.parse(), GroupController.deleteGroup);

//API tim kiem theo cac dieu kien
router.post('/search', formData.parse(), GroupController.getListGroupByFields);

module.exports = router