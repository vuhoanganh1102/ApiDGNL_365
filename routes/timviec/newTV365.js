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
router.get('/getDataCIty', newTV365.getDataCity)

//api lấy dữ liệu của quận huyện của 1 thành phố
router.post('/getDataDistric', newTV365.getDataDistrict)

// api lấy danh sách bài post
router.get('/getDataListPost', functions.checkToken, newTV365.getListPost)

//api lấy 1 bài viết để company cập nhập
router.get('/getDataPost', functions.checkToken, newTV365.getPost)

// api check đăng tin 10p/1 lần
router.get('/checkNew10p', functions.checkToken, newTV365.checkPostNew10p)

// api làm mới tin
router.get('/checkNew10p', functions.checkToken, newTV365.refreshNew)

//api lấy 1 bài viết trước đăng nhập hoặc sau đăng nhập
router.post('/getDataNew', formData.parse(), function(req, res, next) {
    if (req.headers.authorization) {
        functions.checkToken(req, res, next);
    } else {
        next();
    }
}, newTV365.getNew)


// api danh sách việc làm hấp đãn
router.post('/listPostVLHD', formData.parse(), newTV365.listPostVLHD)

// api danh sách việc làm lương cao
router.post('/listPostVLLC', formData.parse(), newTV365.listPostVLLC)

// api danh sách việc làm tuyển gấp
router.post('/listPostVLTG', formData.parse(), newTV365.listPostVLTG)

// api danh sách việc làm mới nhất
router.post('/listJobNew', formData.parse(), newTV365.listJobNew)

module.exports = router;