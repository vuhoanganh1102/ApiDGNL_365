var express = require('express');
var router = express.Router();
const KetQuaDanhGianhanvien =  require('../../controllers/DGNL/KetQuaDanhGia/KetQuaDanhGiaNhanVien');
const KetQuaDanhGiaPhongBan =  require('../../controllers/DGNL/KetQuaDanhGia/KetQuaPhongBan');
const KetQuaDanhGiaCuaToi=  require('../../controllers/DGNL/KetQuaDanhGia/KetQuaCuaToi');
const formData = require("express-form-data")
const functions = require('../../services/functions')
  

router.post('/allDepKQNV', formData.parse(), functions.checkToken, KetQuaDanhGianhanvien.allDepKQNV);
router.post('/allNameKQNV', formData.parse(), functions.checkToken, KetQuaDanhGianhanvien.allNameKQNV);
router.post('/allKhKQNV', formData.parse(), functions.checkToken, KetQuaDanhGianhanvien.allKhKQNV);
router.post('/dulieunv', formData.parse(), functions.checkToken, KetQuaDanhGianhanvien.dulieunv);
router.post('/renderItemKQNV', formData.parse(), functions.checkToken, KetQuaDanhGianhanvien.renderItemKQNV);
router.get('/getKQNV', formData.parse(), functions.checkToken, KetQuaDanhGianhanvien.getKQNV);


router.post('/allPhongBan', formData.parse(), functions.checkToken, KetQuaDanhGiaCuaToi.allPhongBan);
router.post('/allKhdg', formData.parse(), functions.checkToken, KetQuaDanhGiaCuaToi.allKhdg);
router.post('/allusers', formData.parse(), functions.checkToken, KetQuaDanhGiaCuaToi.allusers);
router.post('/KetQuaDanhGiaCuaToi', formData.parse(), functions.checkToken, KetQuaDanhGiaCuaToi.KetQuaDanhGiaCuaToi);


router.post('/KetQuaPhongBan', formData.parse(), functions.checkToken, KetQuaDanhGiaPhongBan.KetQuaPhongBan);
router.post('/allKHDGV2', formData.parse(), functions.checkToken, KetQuaDanhGiaPhongBan.allKHDGV2);
router.post('/allPb', formData.parse(), functions.checkToken, KetQuaDanhGiaPhongBan.allPb);



module.exports = router;