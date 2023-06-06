const router = require('express').Router();
const vanBanRoutes = require('../../../controllers/vanthu/VanBan/vanBan');

router.get('/',vanBanRoutes.showAll)


module.exports = router;