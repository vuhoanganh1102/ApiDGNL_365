// routes/timviec.js
const express = require('express');
const router = express.Router();

const candidateRouter = require('./timviec/candidate');
const companyRouter = require('./timviec/company');
const cvRouter = require('./timviec/cv');
const newTV365Router = require('./timviec/newTV365');
const priceListRouter = require('./timviec/priceList');
const trangVangRouter = require('./timviec/trangVang');
const soSanhLuongRouter = require('./timviec/ssl');
const mail365Router = require('./timviec/mail365');
const adminRouter = require('./timviec/admin');
const blogRouter = require('./timviec/blog');
const donRouter = require('./timviec/don');
const thuRouter = require('./timviec/thu');
const syllRouter = require('./timviec/syll');

router.use('/candidate', candidateRouter);
router.use('/new', newTV365Router);
router.use('/admin', adminRouter);
router.use('/company', companyRouter);
router.use('/blog', blogRouter);
router.use('/cv', cvRouter);
router.use('/don', donRouter);
router.use('/thu', thuRouter);
router.use('/syll', syllRouter);
router.use('/priceList', priceListRouter);
router.use('/trangVang', trangVangRouter);
router.use('/ssl', soSanhLuongRouter);
router.use('/mail365', mail365Router);

module.exports = router;