// routes/hr.js
const express = require('express');
const router = express.Router();

const recruitment = require('./hr/recruitmentRoute');
const trainingRoute = require('./hr/trainingRoute');
const settingRoute = require('./hr/settingRoute');
const administrationRoute = require('./hr/administrationRoute');
const welfare = require('./hr/welfareRoute');
const organizationalStructure = require('./hr/organizationalStructure');

router.use('/recruitment', recruitment);
router.use('/training', trainingRoute);
router.use('/setting', settingRoute);
router.use('/administration', administrationRoute);
router.use('/welfare', welfare);
router.use('/organizationalStructure', organizationalStructure);

module.exports = router;