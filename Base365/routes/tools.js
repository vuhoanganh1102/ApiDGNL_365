var express = require('express');
var router = express.Router();
var toolUser = require('../controllers/tools/user');
var toolTimviec365 = require('../controllers/tools/timviec365');
const formData = require('express-form-data');
const toolRaoNhanh = require('../controllers/tools/raonhanh365')
const qlc = require('../controllers/tools/quanlichung')
const crm = require('../controllers/tools/CRM')

const toolHr =  require('../controllers/tools/hr');
const toolVanThu = require('../controllers/tools/vanthu')
const toolCRM = require('../controllers/tools/CRM')



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



// api quet tool van thu
router.post('/toolCateDexuat',toolVanThu.toolCateDeXuat);
router.post('/toolDeXuat',toolVanThu.toolDeXuat);
router.post('/toolDeXuatXuLy',toolVanThu.toolDeXuatXuLy);
router.post('/toolDeleteDeXuat',toolVanThu.toolDeleteDX);
router.post('/toolGhiChu',toolVanThu.toolGhiChu);
router.post('/toolGroupVanBan',toolVanThu.toolGroupVanBan);
router.post('/toolHideCateDX',toolVanThu.toolhideCateDX);
router.post('/toolHistoryHandlingDX',toolVanThu.toolHistoryHDX);
router.post('/toolLyDo',toolVanThu.toolLyDo);
router.post('/toolPhongBan',toolVanThu.toolPhongBan);
router.post('/toolSettingDX',toolVanThu.toolSettingDX);


// api quét data recruitment
// router.post('/toolrecruitment',toolHr.recruitment)
// router.post('/toolrecruitment_news',toolHr.recruitment_news)
// router.post('/toolschedule_interview',toolHr.schedule_interview)
router.post('/toolcancelJob',toolHr.cancelJob)
router.post('/toolFailJob',toolHr.failJob)
router.post('/toolContactJob',toolHr.contactJob)
router.post('/toolNotify',toolHr.notify)
router.post('/toolPermission',toolHr.permission)
router.post('/toolPolicys',toolHr.policy)
router.post('/toolstageRecruitment',toolHr.stageRecruitment)

// api quét data HR Cường
router.post('/toolAchievementFors',toolHr.AchievementFors)
router.post('/toolAddInfoLeads',toolHr.AddInfoLeads)
router.post('/toolBlogs',toolHr.Blogs)
router.post('/toolCategorys',toolHr.Categorys)
router.post('/toolCiSessions',toolHr.CiSessions)
router.post('/toolCitys',toolHr.Citys)
router.post('/toolCrontabQuitJobs',toolHr.CrontabQuitJobs)
router.post('/toolDepartmentDetails',toolHr.DepartmentDetails)
router.post('/toolDescPositions',toolHr.DescPositions)
router.post('/toolDevices',toolHr.Devices)
router.post('/toolInfoLeaders',toolHr.InfoLeaders)
router.post('/toolInfringesFors',toolHr.InfringesFors)
router.post('/toolavatar',toolHr.avatar)


// api
//----------------------------------------------api quet data HR----------------------
router.post('/hr/jobDes',toolHr.toolJobDes);
router.post('/hr/anotherSkill', toolHr.toolAnotherSkill);
router.post('/hr/perDetail', toolHr.toolPermisionDetail);
router.post('/hr/remind', toolHr.toolRemind);
router.post('/hr/processInter', toolHr.toolProcessInterview);
router.post('/hr/processTraining', toolHr.toolProcessTraining);
router.post('/hr/signature', toolHr.toolSignatureImage);
router.post('/hr/scheduleInter', toolHr.toolScheduleInterview);
router.post('/hr/inviteInter', toolHr.toolInviteInterview);
router.post('/hr/recruitment', toolHr.toolRecruitment);
router.post('/hr/recruitmentNews', toolHr.toolRecruitmentNews);

//Api quét data CRM

router.post('/toolContract',toolCRM.toolContact)//danh sách hợp đồng 
router.post('/toolCC',toolCRM.toolContactCustomer)// danh sach hơp đòng khách hàng
router.post('/toolCs',toolCRM.toolCustomer)// danh sách hợp đồng khách hàng
router.post('/toolCr',toolCRM.toolCustomerCare)// danh sách chăm sóc khách hàng
router.post('/toolCuchan',toolCRM.toolCustomerChance) // danh sách khách hàng cơ hội
router.post('/toolChanfile',toolCRM.toolCustomerChanceFile)
router.post('/toolChanfoot',toolCRM.toolChanFoots)
router.post('/toolCusfile',toolCRM.toolCusFile)
router.post('/toolCG',toolCRM.toolCustomerGroup)
router.post('/toolCmulti',toolCRM.toolCustomeMulti)
router.post('/toolCnote',toolCRM.toolCustomerNote)
router.post('/toolCstatus',toolCRM.toolCustomerStatus)

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
router.get('/toolDetailEmailSms', crm.toolDetailFormContract);
module.exports = router;