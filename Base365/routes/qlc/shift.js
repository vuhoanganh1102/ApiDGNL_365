const router = require('express').Router();
const functions= require ("../../services/functions")
const ShiftController = require('../../controllers/qlc/Shift')

var formData = require('express-form-data')
//API lấy toàn bộ danh sách ca làm việc
router.get("/listAll",formData.parse(),functions.checkToken, ShiftController.getListShifts)

//API lấy ca làm việc theo id
router.get("/getbyId",formData.parse(),functions.checkToken, ShiftController.getShiftById)

//API tạo một ca làm việc mới
router.post("/create",formData.parse(),functions.checkToken, ShiftController.createShift)

//API chỉnh sửa thông tin của một ca làm việc
router.post("/edit",formData.parse(),functions.checkToken, ShiftController.editShift)

//API xóa toàn bộ ca làm việc của một công ty
router.delete("/detete",formData.parse(),functions.checkToken, ShiftController.deleteShiftCompany)

module.exports = router