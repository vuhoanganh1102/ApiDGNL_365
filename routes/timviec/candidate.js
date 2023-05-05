const express = require('express');

const candidate = require('../../controllers/timviec/candidate');
const formData = require('express-form-data');
const router = express.Router();
const {uploadFile} = require('../../services/functions.js');
const { route } = require('..');

router.get('/', candidate.index);
router.post('/RegisterB1',formData.parse(), candidate.RegisterB1);
router.post('/RegisterB2CvUpload',uploadFile.single('videoUpload'), candidate.RegisterB2VideoUpload);
router.post('/login',formData.parse(),candidate.login);


module.exports = router;