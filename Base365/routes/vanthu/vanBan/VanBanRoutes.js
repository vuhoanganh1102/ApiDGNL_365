const router = require('express').Router();
const vanBanRoutes = require('../../../controllers/vanthu/VanBan/vanBan');
const formData = require('express-form-data')

//Hiển thị toàn bộ danh sách văn Bản

router.get('/',vanBanRoutes.showAll)


//tạo mới văn bản gửi trong công ty

router.post('/addincompany',formData.parse().vanBanRoutes.inCompany)

//tạo mới văn bản gửi ngoài công ty

module.exports = router;