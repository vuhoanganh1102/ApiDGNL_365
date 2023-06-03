const router = require('express').Router();
const TeamController = require('../../controllers/qlc/team')
const formData = require('express-form-data')
const functions = require("../../services/functions")

//Lấy toàn bộ dữ liệu tổ
router.get("/",functions.checkToken, TeamController.getListTeam);

//Lấy dữ liệu của một tổ
router.get("/:id",functions.checkToken, TeamController.getTeamById);

//Tạo mới dữ liệu của một tổ
router.post("/",functions.checkToken,formData.parse(), TeamController.createTeam);
//API đếm số lượng nhân viên trong tổ
router.post("/team",functions.checkToken,formData.parse(), TeamController.countUserInTeam);
//Chỉnh sửa dự liệu của một tổ
router.post("/:id",functions.checkToken,formData.parse(), TeamController.editTeam);

//Xóa dữ liệu của một tổ
router.delete("/:id",functions.checkToken,formData.parse(), TeamController.deleteTeam);

//Xoá toàn bộ dữ liệu tổ
router.delete("/",functions.checkToken, TeamController.deleteAllTeams)

module.exports = router