const express = require('express');
const formData = require('express-form-data');

const newTV365 = require('../../controllers/timviec/newTV365')
const router = express.Router();
const functions = require('../../services/functions')

// api đăng tin tuyển dụng
router.post('/postNewTv365',
    functions.checkToken,
    functions.uploadVideoAndIMGNewTV.fields([
        { name: 'avatarUser' },
        { name: 'videoType' }
    ]),
    newTV365.postNewTv365
);
router.post('/updateNewTv365',
    functions.checkToken,
    functions.uploadVideoAndIMGNewTV.fields([
        { name: 'avatarUser' },
        { name: 'videoType' }
    ]),
    newTV365.updateNewTv365
);
router.delete('/deleteNewTv365/:idNew', functions.checkToken, newTV365.deleteNewTv365)
    //api lấy dữ liệu của thành phố
    // router.get('/getDataCIty', newTV365.getDataCity)

//api lấy dữ liệu của quận huyện của 1 thành phố
// router.post('/getDataDistric', newTV365.getDataDistrict)

// api lấy danh sách bài post
router.get('/getDataListPost', functions.checkToken, newTV365.getListPost)

//api lấy 1 bài viết để company cập nhập
router.get('/getDataPost', functions.checkToken, newTV365.getPost)

// api check đăng tin 10p/1 lần
router.get('/checkNew10p', functions.checkToken, newTV365.checkPostNew10p)

// api làm mới tin
router.get('/checkNew10p', functions.checkToken, newTV365.refreshNew)

//api lấy 1 bài viết trước đăng nhập hoặc sau đăng nhập
router.post('/detail', formData.parse(), function(req, res, next) {
    if (req.headers.authorization) {
        functions.checkToken(req, res, next);
    } else {
        next();
    }
}, newTV365.detail)


// api danh sách việc làm hấp đãn
// router.post('/listNewHot', formData.parse(), newTV365.listNewHot)

// api danh sách việc làm lương cao
// router.post('/listNewCao', formData.parse(), newTV365.listNewCao)

// api danh sách việc làm tuyển gấp
// router.post('/listNewGap', formData.parse(), newTV365.listNewGap)

// api danh sách việc làm mới nhất
// router.post('/listJobNew', formData.parse(), newTV365.listJobNew)

// api danh sách việc phù hợp nhất
// router.post('/listJobSuitable', formData.parse(), newTV365.listJobSuitable)

// api danh sách việc lương cao
// router.post('/listJobHightSalary', formData.parse(), newTV365.listJobHightSalary)

// api danh sách việc địa điểm tag
// router.post('/getJobListByLocation', formData.parse(), newTV365.getJobListByLocation)

// api danh sách việc tên công ty tag
// router.post('/getJobListByCompany', formData.parse(), newTV365.getJobListByCompany)

// api danh sách việc tên công ty tag
// router.post('/getJobListByJob', formData.parse(), newTV365.getJobListByJob)

// api danh sách việc tiêu chí tag
// router.post('/getJobsByCriteria', formData.parse(), newTV365.getJobsByCriteria)


// Mới

//trang chủ
router.post('/homePage', formData.parse(), newTV365.homePage)
    //trang chủ
router.post('/listJobBySearch', formData.parse(), newTV365.listJobBySearch)

//Like và bỏ like tin hoặc bình luận
router.post('/likeNew', formData.parse(), functions.checkToken, newTV365.likeNew)

module.exports = router;