const router = require('express').Router();
const DeparmentController = require('../../controllers/qlc/deparment')
const functions= require ("../../services/functions")
//API lấy tất cả dữ liệu phòng ban 
router.get("/",functions.checkToken, DeparmentController.getListDeparment);
//API lấy tất cả dữ liệu phòng ban 
router.get("/count",functions.checkToken, DeparmentController.countUserInDepartment);

//API lấy dữ liệu một phòng ban
router.get("/:id",functions.checkToken,  DeparmentController.getDeparmentById);

//API tạo mới một phòng ban
router.post("/", functions.checkToken, DeparmentController.createDeparment);

//API thay dổi thông tin của một phòng ban
router.post("/:id", functions.checkToken, DeparmentController.editDeparment);

//API xóa một phòng ban theo id
router.delete("/:id",functions.checkToken,  DeparmentController.deleteDeparment);

// API xóa toàn bộ phòng ban hiện có
router.delete("/", functions.checkToken, DeparmentController.deleteAllDeparmants);

module.exports = router