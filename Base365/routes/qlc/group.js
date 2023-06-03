const router = require('express').Router();
const GroupController = require('../../controllers/qlc/group')
const formData =require('express-form-data')
//API lấy tất cả dữ liệu nhóm
router.get("/", GroupController.getListGroup);

//API lấy dữ liệu một nhóm
router.get("/:id", GroupController.getGroupById);

//Api tạo một nhóm mới
router.post("/",formData.parse(), GroupController.createGroup);

//API đếm số lượng nhân viên trong nhóm
router.post("/count", formData.parse(), GroupController.countUserInGroup);

//API thay đổi thông tin của một nhóm
router.post("/:id",formData.parse(), GroupController.editGroup);

//API Xóa một nhóm theo id
router.delete("/:id",formData.parse(), GroupController.deleteGroup);

//API xóa toàn bộ nhóm hiện có
router.delete("/", GroupController.deleteAllGroups)

module.exports = router