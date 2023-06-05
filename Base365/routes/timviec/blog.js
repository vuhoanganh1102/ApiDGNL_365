var express = require('express');
var router = express.Router();
var blog = require('../../controllers/timviec/blog');
var formData = require('express-form-data');
const functions = require('../../services/functions');

// api lấy danh sách blog
router.post('/getListBlog', formData.parse(), blog.listBlog);

// api lấy chi tiết blog
router.post('/getBlogDetail', formData.parse(), blog.getBlogDetail);

// api chi tiết tác giả
router.post('/getAuthorDetail', formData.parse(), blog.getAuthorDetail);

// api danh sách danh mục
router.post('/getListCategoryBlog', formData.parse(), blog.getListCategoryBlog);

// api danh sách blog theo danh mục
router.post('/getCategoryBlog', formData.parse(), blog.getCategoryBlog);

//cẩm nang
router.post('/getHandBook', formData.parse(), blog.getHandBook);
module.exports = router;