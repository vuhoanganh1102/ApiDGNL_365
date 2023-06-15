var express = require('express');
var router = express.Router();
var toolUser = require('../controllers/tools/user');
var toolTimviec365 = require('../controllers/tools/timviec365');
const formData = require('express-form-data');
const toolRaoNhanh = require('../controllers/tools/raonhanh365')
const qlc = require('../controllers/tools/quanlichung')
const crm = require('../controllers/tools/CRM')

// API quét data người dùng từ base chat
router.get('/addUserChat365', formData.parse(), toolUser.addUserChat365);
router.get('/addUserCompanyTimviec365', toolUser.addUserCompanyTimviec365);
router.get('/addUserCandidateTimviec365', toolUser.addUserCandidateTimviec365);
router.get('/deleteUser', toolUser.deleteUser);

//API Quản lí chung 
router.post('/toolSettingIP', qlc.toolsettingIP);
router.post('/toolDeparment', qlc.toolDeparment);
router.post('/toolGroup', qlc.toolGroup);
router.post('/toolCompany', qlc.toolCompany);
router.post('/toolHisTracking', qlc.toolHisTracking);
router.post('/toolCheckDevice', qlc.toolCheckDevice);
router.post('/toolShifts', qlc.toolShifts);
router.post('/toolFeedback', qlc.toolFeedback);
router.post('/toolReportError', qlc.toolReportError);
router.post('/toolCalendarWorkEmployee', qlc.toolCalendarWorkEmployee);




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
router.post('/toolNewRN', toolRaoNhanh.toolNewRN);

router.post('/toolCategory', toolRaoNhanh.toolCategory);

// api update thông tin bán hàng  new rao nhanh
router.post('/updateInfoSell', toolRaoNhanh.updateInfoSell);

router.post('/toolPriceList', toolRaoNhanh.toolPriceList);
router.post('/raonhanh/toolCity', toolRaoNhanh.toolCity);
router.post('/raonhanh/toolLike', toolRaoNhanh.toolLike);




// api quét data các phần của chi tiết danh mục Raonhanh
// router.post('/toolCateDetail', toolRaoNhanh.toolCateDetail);

//CRM
router.get('/toolCampaign', crm.toolCampaign);
router.get('/toolDetailCampaign', crm.toolDetailCampaign);
router.get('/toolTablePriceList', crm.toolTablePriceList);
router.get('/toolDetailPriceList', crm.toolDetailPriceList);
router.get('/toollistSurvey', crm.toollistSurvey);
router.get('/toolAppointmentSchedule', crm.toolAppointmentSchedule);
router.get('/toolHistoryCustomerCare', crm.toolHistoryCustomerCare);
router.get('/toolFundbook', crm.toolFundbook);
router.get('/toolForm', crm.toolForm);
router.get('/toolFormContract', crm.toolFormContract);
router.get('/toolFormEmail', crm.toolFormEmail);
router.get('/toolFormRegister', crm.toolFormRegister);
router.get('/toolEmailPersonal', crm.toolEmailPersonal);
router.get('/toolEmailSms', crm.toolEmailSms);
router.get('/toolEmailSystem', crm.toolEmailSystem);
router.get('/toolGroupSupplier', crm.toolGroupSupplier);
router.get('/toolGroupPins', crm.toolGroupPins);
router.get('/toolDetailSurvery', crm.toolDetailSurvery);
router.get('/toolDetailReturnProduct', crm.toolDetailReturnProduct);
router.get('/toolDetailListOrder', crm.toolDetailListOrder);
router.get('/toolDetailFormContract', crm.toolDetailFormContract);
router.get('/toolDetailEmailSms', crm.toolDetailEmailSms);


module.exports = router;