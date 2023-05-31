const router = require('express').Router();
const TeamController = require('../../controllers/qlc/team')

const functions = require("../../services/functions")

//Lấy toàn bộ dữ liệu tổ
router.get("/",functions.checkToken, TeamController.getListTeam);

//Lấy dữ liệu của một tổ
router.get("/:id",functions.checkToken, TeamController.getTeamById);

//Tạo mới dữ liệu của một tổ
router.post("/",functions.checkToken, TeamController.createTeam);

//Chỉnh sửa dự liệu của một tổ
router.post("/:id",functions.checkToken, TeamController.editTeam);

//Xóa dữ liệu của một tổ
router.delete("/:id",functions.checkToken, TeamController.deleteTeam);

//Xoá toàn bộ dữ liệu tổ
router.delete("/",functions.checkToken, TeamController.deleteAllTeams)

module.exports = router