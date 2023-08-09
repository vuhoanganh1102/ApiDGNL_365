var express = require('express');
var router = express.Router();

var candidateRouter = require('./timviec/candidate');
var companyRouter = require('./timviec/company');
var cvRouter = require('./timviec/cv');
var appliRouter = require('./timviec/jobApplication');
var letterRouter = require('./timviec/letter');
var syllRouter = require('./timviec/syll');
var newTV365Router = require('./timviec/newTV365');
var adminRouter = require('./timviec/admin');
var blogRouter = require('./timviec/blog');
var bodeRouter = require('./timviec/bo_de');
var bieumauRouter = require('./timviec/bm');
var priceListRouter = require('./timviec/priceList');
var trangVangRouter = require('./timviec/trangVang');
var permistionNotifyRouter = require('./timviec/permistionNotify');
var mail365Router = require('./timviec/mail365');
var sslRouter = require('./timviec/ssl');
var accountRouter = require('./timviec/account');
var companyVipRouter = require('./timviec/company_vip');
var creditsRouter = require('./timviec/credits');
var tools = require('../controllers/tools/timviec365');


router.use('/candidate', candidateRouter);
router.use('/new', newTV365Router);
router.use('/admin', adminRouter);
router.use('/company', companyRouter);
router.use('/blog', blogRouter);
router.use('/chpv', bodeRouter);
router.use('/cv', cvRouter);
router.use('/appli', appliRouter);
router.use('/letter', letterRouter);
router.use('/syll', syllRouter);
router.use('/mail365', mail365Router);
router.use('/bm', bieumauRouter);
router.use('/permission', permistionNotifyRouter);
router.use('/trangVang', trangVangRouter);
router.use('/priceList', priceListRouter);
router.use('/ssl', sslRouter);
router.use('/account', accountRouter);
router.use('/company/vip', companyVipRouter);
router.use('/credits', creditsRouter);
router.get('/normalize/EPH', tools.normalizeExchangePointHistory);
router.get('/normalize/PL', tools.normalizePriceList);

module.exports = router;