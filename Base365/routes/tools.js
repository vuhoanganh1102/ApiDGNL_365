var express = require('express');
var router = express.Router();
var toolUser = require('../controllers/tools/user');
var toolTimviec365 = require('../controllers/tools/timviec365');
const formData = require('express-form-data');

// API quét data người dùng từ base chat
router.post('/addUserChat365', formData.parse(), toolUser.addUserChat365);
router.post('/addUserCompanyTimviec365', toolUser.addUserCompanyTimviec365);
router.post('/addUserCandidateTimviec365', toolUser.addUserCandidateTimviec365);
router.post('/deleteUser', toolUser.deleteUser);

// api quét data keywork
router.post('/addKeyword', toolTimviec365.toolKeyword);

// api quét data admin user
router.post('/toolAddAdminUSer', toolTimviec365.toolAddAdminUSer);

// api quét data lĩnh vực
router.post('/toolLV', toolTimviec365.toolLV);

// api quét data newTV365
router.post('/toolNewTV365', toolTimviec365.toolNewTV365);

// api quét data mẫu cv
router.post('/toolCV', toolTimviec365.toolCV);

// api quét data category blog
router.post('/toolCategoryBlog', toolTimviec365.toolCategoryBlog);

// api quét data danh sách ngành cv
router.post('/toolCVCategory', toolTimviec365.toolCVCategory);

// api quét data cv của ứng viên
router.post('/toolCVUV', toolTimviec365.toolCVUV);

// api quét data ngon ngu cv 
router.post('/toolCVLang', toolTimviec365.toolCVLang);

// api quét data mẫu đơn xin việc
router.post('/toolApplication', toolTimviec365.toolApplication);

module.exports = router;