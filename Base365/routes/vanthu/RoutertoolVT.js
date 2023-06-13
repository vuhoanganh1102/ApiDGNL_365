const router = require('express').Router();


const toolVanThu = require("../../controllers/tools/vanthu");
router.post('/toolCateDexuat', toolVanThu.toolCateDeXuat);
router.post('/toolDeXuat', toolVanThu.toolDeXuat);
router.post('/toolDeXuatXuLy', toolVanThu.toolDeXuatXuLy);
router.post('/toolDeleteDeXuat', toolVanThu.toolDeleteDX);
router.post('/toolGhiChu', toolVanThu.toolGhiChu);
router.post('/toolGroupVanBan', toolVanThu.toolGroupVanBan);
router.post('/toolHideCateDX', toolVanThu.toolhideCateDX);
router.post('/toolHistoryHandlingDX', toolVanThu.toolHistoryHDX);
router.post('/toolLyDo', toolVanThu.toolLyDo);
router.post('/toolPhongBan', toolVanThu.toolPhongBan);
//router.post('/toolSettingDX', toolVanThu.toolSettingDX);
module.exports = router;