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

// api quét data category blog
router.post('/tooBlog', toolTimviec365.toolBlog);

// api quét data danh sách ngành cv
router.post('/toolCVCategory', toolTimviec365.toolCVCategory);


// api quét data cv của ứng viên
router.post('/toolCVUV', toolTimviec365.toolCVUV);

// api quét data ngon ngu cv 
router.post('/toolCVLang', toolTimviec365.toolCVLang);

// api quét data mẫu đơn xin việc
router.post('/toolApplication', toolTimviec365.toolApplication);

// api quét data đơn của UV
router.post('/toolApplicationUV', toolTimviec365.toolApplicationUV);

// api quét data thu của UV
router.post('/toolLetterUV', toolTimviec365.toolLetterUV);

// api quét data syll của UV
router.post('/toolResumeUV', toolTimviec365.toolResumeUV);

// api quét data mẫu thư
router.post('/toolLetter', toolTimviec365.toolLetter);

// api quét data mẫu syll
router.post('/toolResume', toolTimviec365.toolResume);

// api quét data thiết kế cv
router.post('/toolCVDesign', toolTimviec365.toolCVDesign);

// api quét data nhom cv
router.post('/toolCVGroup', toolTimviec365.toolCVGroup);

// api quét data bảng giá
router.post('/toolPriceList', toolTimviec365.toolPriceList);

// api quét data chuyên mục
router.post('/toolCVSection', toolTimviec365.toolCVSection);

// api quét data poincompany
router.post('/toolPoinCompany', toolTimviec365.toolPoinCompany);

// api quét data PointUse
router.post('/toolPointUse', toolTimviec365.toolPointUse);

// api quét data nganh don
router.post('/toolNgangDon', toolTimviec365.toolNgangDon);

// api quét data nganh thu
router.post('/toolNgangThu', toolTimviec365.toolNgangThu);

module.exports = router;