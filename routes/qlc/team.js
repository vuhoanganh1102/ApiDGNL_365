const router = require('express').Router();
const TeamController = require('../../controllers/qlc/team')

const functions = require("../../services/functions")

//Lấy toàn bộ dữ liệu tổ
router.get("/", TeamController.getListTeam);

//Lấy dữ liệu của một tổ
router.get("/:id", TeamController.getTeamById);

//Tạo mới dữ liệu của một tổ
router.post("/", TeamController.createTeam);

//Chỉnh sửa dự liệu của một tổ
router.put("/:id", TeamController.editTeam);

//Xóa dữ liệu của một tổ
router.delete("/:id", TeamController.deleteTeam);

//Xoá toàn bộ dữ liệu tổ
router.delete ("/", TeamController.deleteAllTeams)

module.exports = router