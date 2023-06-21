var express = require('express');
var router = express.Router();

var candidateRouter = require('./timviec/candidate');
var companyRouter = require('./timviec/company');
var cvRouter = require('./timviec/cv');
var newTV365Router = require('./timviec/newTV365');
var priceListRouter = require('./timviec/priceList');
var trangVangRouter = require('./timviec/trangVang');
var soSanhLuongRouter = require('./timviec/ssl');
var mail365Router = require('./timviec/mail365');
var adminRouter = require('./timviec/admin');
var blogRouter = require('./timviec/blog');
var donRouter = require('./timviec/don');
var thuRouter = require('./timviec/thu');
var syllRouter = require('./timviec/syll');

router.use('/candidate', candidateRouter);
router.use('/company', companyRouter);
router.use('/cv', cvRouter);
router.use('/new', newTV365Router);
router.use('/priceList', priceListRouter);
router.use('/trangVang', trangVangRouter);
router.use('/ssl', soSanhLuongRouter);
router.use('/mail365', mail365Router);
router.use('/admin', adminRouter);
router.use('/blog', blogRouter);
router.use('/don', donRouter);
router.use('/thu', thuRouter);
router.use('/syll', syllRouter);

module.exports = router;