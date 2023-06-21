var express = require('express');
var router = express.Router();
var toolUser = require('../controllers/tools/user');
var toolTimviec365 = require('../controllers/tools/timviec365');
const formData = require('express-form-data');
const toolRaoNhanh = require('../controllers/tools/raonhanh365');
const toolHr =  require('../controllers/tools/hr');


// API quét data người dùng từ base chat
router.get('/addUserChat365', formData.parse(), toolUser.addUserChat365);
router.get('/addUserCompanyTimviec365', toolUser.addUserCompanyTimviec365);
router.get('/addUserCandidateTimviec365', toolUser.addUserCandidateTimviec365);
router.get('/deleteUser', toolUser.deleteUser);

// api quét data keywork
router.get('/addKeyword', toolTimviec365.toolKeyword);

// api quét data admin user
router.get('/toolAddAdminUSer', toolTimviec365.toolAddAdminUSer);

// api quét data lĩnh vực
router.get('/toolLV', toolTimviec365.toolLV);

// api quét data newTV365
router.get('/toolNewTV365', toolTimviec365.toolNewTV365);

// api quét data newTV365
router.get('/toolNewMultiTV365', toolTimviec365.toolNewMultiTV365);

// api quét data newTV365
router.get('/toolNewMoney', toolTimviec365.toolNewMoney);

// api quét data mẫu cv
router.get('/toolCV', toolTimviec365.toolCV);

// api quét data category blog
router.get('/toolCategoryBlog', toolTimviec365.toolCategoryBlog);

// api quét data category blog
router.get('/tooBlog', toolTimviec365.toolBlog);

// api quét data danh sách ngành cv
router.get('/toolCVCategory', toolTimviec365.toolCVCategory);


// api quét data cv của ứng viên
router.get('/toolCVUV', toolTimviec365.toolCVUV);

// api quét data ngon ngu cv 
router.get('/toolCVLang', toolTimviec365.toolCVLang);

// api quét data mẫu đơn xin việc
router.get('/toolApplication', toolTimviec365.toolApplication);

// api quét data đơn của UV
router.get('/toolApplicationUV', toolTimviec365.toolApplicationUV);

// api quét data thu của UV
router.get('/toolLetterUV', toolTimviec365.toolLetterUV);

// api quét data danh sách ngành syll
router.post('/toolResumeCategory', toolTimviec365.toolResumeCategory);

// api quét data syll của UV
router.get('/toolResumeUV', toolTimviec365.toolResumeUV);

// api quét data mẫu thư
router.get('/toolLetter', toolTimviec365.toolLetter);

// api quét data mẫu syll
router.get('/toolResume', toolTimviec365.toolResume);

// api quét data thiết kế cv
router.get('/toolCVDesign', toolTimviec365.toolCVDesign);

// api quét data nhom cv
router.get('/toolCVGroup', toolTimviec365.toolCVGroup);

// api quét data bảng giá
router.get('/toolPriceList', toolTimviec365.toolPriceList);

// api quét data chuyên mục
router.get('/toolCVSection', toolTimviec365.toolCVSection);

// api quét data poincompany
router.get('/toolPoinCompany', toolTimviec365.toolPoinCompany);

// api quét data PointUse
router.get('/toolPointUse', toolTimviec365.toolPointUse);

// api quét data nganh don
router.get('/toolNgangDon', toolTimviec365.toolNgangDon);

// api quét data nganh thu
router.get('/toolNgangThu', toolTimviec365.toolNgangThu);

// api quét data email 365
router.post('/toolEmail365', toolTimviec365.toolEmail365);

// api quét data danh mục email

router.post('/toolEmail365Cate', toolTimviec365.toolEmail365Cate);

// api quét data danh mục sản phẩm _ Raonhanh
router.post('/toolCateRaonhanh', toolRaoNhanh.toolCategory);

//api quét data ứng viên ứng tuyển ( Apply For Job)
router.post('/toolApplyForJob', toolTimviec365.toolApplyForJob);

//api quét data ứng viên lưu việc làm
router.post('/toolUserSavePost', toolTimviec365.toolUserSavePost);


//--------------------TOOLS RAONHANH365

// api quét data new rao nhanh







module.exports = router;