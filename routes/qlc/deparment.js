const router = require('express').Router();
const DeparmentController = require('../../controllers/qlc/deparment')

//API lấy tất cả dữ liệu phòng ban 
router.get("/", DeparmentController.getListDeparment);

//API lấy dữ liệu một phòng ban
router.get("/:id", DeparmentController.getDeparmentById);

//API tạo mới một phòng ban
router.post("/", DeparmentController.createDeparment);

//API thay dổi thông tin của một phòng ban
router.post("/:id", DeparmentController.editDeparment);

//API xóa một phòng ban theo id
router.delete("/:id", DeparmentController.deleteDeparment);

// API xóa toàn bộ phòng ban hiện có
router.delete("/", DeparmentController.deleteAllDeparmants);

module.exports = router