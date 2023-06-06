var express = require('express');
var router = express.Router();
var blog = require('../../controllers/raonhanh365/blog');
var formData = require('express-form-data');
const functions = require('../../services/functions');

//api lay ra danh sach blog theo cac truong
router.post('/getBlog', formData.parse(), functions.checkToken, blog.getListBlogByFields);

//api admin tao blog
router.post('/createBlog', formData.parse(), [functions.checkToken, functions.isAdminRN365], blog.getAndCheckData, blog.createBlog);

//api admin cap nhat blog
router.put('/updateBlog', formData.parse(), [functions.checkToken, functions.isAdminRN365], blog.getAndCheckData ,blog.updateBlog);

//api xoa 1 blog by id hoac xoa tat ca
router.delete('/deleteBlog', [functions.checkToken, functions.isAdminRN365], blog.deleteBlog);

module.exports = router;