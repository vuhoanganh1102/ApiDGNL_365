const router = require('express').Router();
const GroupController = require('../../controllers/qlc/group')

//API lấy tất cả dữ liệu nhóm
router.get("/", GroupController.getListGroup);

//API lấy dữ liệu một nhóm
router.get("/:id", GroupController.getGroupById);

//Api tạo một nhóm mới
router.post("/", GroupController.createGroup);

//API thay đổi thông tin của một nhóm
router.post("/:id", GroupController.editGroup);

//API Xóa một nhóm theo id
router.delete("/:id", GroupController.deleteGroup);

//API xóa toàn bộ nhóm hiện có
router.delete("/", GroupController.deleteAllGroups)

module.exports = router