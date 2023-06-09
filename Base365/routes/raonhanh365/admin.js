var express = require('express');
var router = express.Router();
var blog = require('../../controllers/raonhanh365/blog');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const authJwt = require("../../middleware/authJwt");

//api danh sach tai khoan gian hàng
router.get('/boothAccount',[authJwt.checkToken, authJwt.isCompany],)