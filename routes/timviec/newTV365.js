const express = require('express');
const formData = require('express-form-data');

const newTV365=require('../../controllers/timviec/newTV365')
const router = express.Router();
const functions=require('../../services/functions')

// api đăng tin tuyển dụng
router.post('/postNewTv365', 
  functions.checkToken, 
  functions.uploadVideoAndIMGNewTV.fields([
    { name: 'avatarUser', maxCount:6 },
    { name: 'videoType', maxCount: 1 }
  ]), 
  newTV365.postNewTv365
);

//api lấy dữ liệu của thành phố
router.get('/getDataCIty',newTV365.getDataCity)

//api lấy dữ liệu của quận huyện của 1 thành phố
router.post('/getDataDistric',formData.parse(),newTV365.getDataDistrict)

// api lấy danh sách bài post
router.get('/getDataListPost',functions.checkToken,newTV365.getListPost)

//api lấy 1 bài viết
router.get('/getDataPost',functions.checkToken,newTV365.getPost) 

// api check đăng tin 10p/1 lần
router.get('/checkNew10p',functions.checkToken,newTV365.checkPostNew10p) 
module.exports = router;