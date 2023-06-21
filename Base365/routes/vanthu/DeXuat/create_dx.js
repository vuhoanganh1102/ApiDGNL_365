const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const Controller = require('../../../controllers/vanthu/DeXuat/create_dx');

console.log("router");
router.post('/De_Xuat_Xin_Nghi', formData.parse(), Controller.de_xuat_xin_nghi);
router.post('/De_Xuat_Xin_Bo_Nhiem', formData.parse(), Controller.de_xuat_xin_bo_nhiem);
router.post('/De_Xuat_Cap_Phat_Tai_San', formData.parse(), Controller.de_xuat_xin_cap_phat_tai_san);
router.post('/De_Xuat_Xin_Doi_Ca', formData.parse(), Controller.de_xuat_doi_ca);
router.post('/De_Xuat_Luan_Chuyen_Cong_Tac', formData.parse(), Controller.de_xuat_luan_chuyen_cong_tac);
router.post('/De_Xuat_Xin_Tang_Luong', formData.parse(), Controller.de_xuat_tang_luong);
router.post('/De_Xuat_Tham_Gia_Du_An', formData.parse(), Controller.de_xuat_tham_gia_du_an);
router.post('/De_Xuat_Xin_Tam_Ung', formData.parse(), Controller.de_xuat_xin_tam_ung);
router.post('/De_Xuat_Xin_thoi_Viec', formData.parse(), Controller.de_xuat_xin_thoi_Viec);
router.post('/De_Xuat_Lich_Lam_Viec', formData.parse(), Controller.lich_lam_viec);
module.exports = router;
