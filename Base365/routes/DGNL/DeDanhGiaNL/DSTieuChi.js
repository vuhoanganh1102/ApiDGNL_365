const router = require('express').Router();
const controller = require('../../../controllers/DanhGiaNangLuc/DSTieuChi/DSTieuChi');

var formData = require('express-form-data');
const functions = require('../../../services/functions')


router.post('/NameAndStationTC',functions.checkToken,formData.parse(),controller.SearchTieuChi)
router.post('/addTC',functions.checkToken, formData.parse(), controller.ThemMoiTC)
router.post('/ChiTietTC',formData.parse(),controller.ChiTietTC)
router.patch('/changeStation', formData.parse(),controller.ChangeStation)
router.put('/deleteStation', formData.parse(),controller.XoaTC)
router.patch('/ChinhSuaTc',formData.parse(),controller.ChinhSua)
router.post('/searchTC',functions.checkToken,formData.parse(),controller.searchTC)
router.post('/listTC',functions.checkToken,formData.parse(),controller.listTC)
router.post('/searchTCD',functions.checkToken,formData.parse(),controller.searchTCD)

module.exports = router