const router = require('express').Router();
const settingVanthu = require("../../controllers/vanthu/Setting/Setting")
var formData = require('express-form-data');

//Api lấy dữ liệu settiing
router.get('/',settingVanthu.getSettings);


// Api lấy dữ liệu
router.post('/',formData.parse(),settingVanthu.findOneSetting);


// Api thêm dữ liệu vào setting
router.post('/addSetting', formData.parse(),settingVanthu.createSettingDx);


// Api sửa setting
router.put('/:id',formData.parse(),settingVanthu.editSettingDx);


//Api xóa setting
router.delete('/:id',settingVanthu.removeSetting);

module.exports = router