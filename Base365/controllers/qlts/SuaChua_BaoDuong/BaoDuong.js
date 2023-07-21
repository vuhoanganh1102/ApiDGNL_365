const fnc = require('../../../services/functions');
const ThongBao = require('../../../models/QuanLyTaiSan/ThongBao');
const BaoDuong = require('../../../models/QuanLyTaiSan/BaoDuong');
const QuaTrinhSuDung = require('../../../models/QuanLyTaiSan/QuaTrinhSuDung');
const TaiSan = require('../../../models/QuanLyTaiSan/TaiSan');
const TaiSanDangSuDung = require("../../../models/QuanLyTaiSan/TaiSanDangSuDung");
const { errorMonitor } = require('nodemailer/lib/xoauth2');
// Tĩnh
//tai sản cần bảo dưỡng
//add_baoduong
exports.add_Ts_can_bao_duong = async (req, res) => {
    try {
        let { id_ts, sl_bd, trang_thai_bd, cs_bd, type_quyen, ngay_bd, ngay_dukien_ht, ngay_ht_bd, chiphi_dukien, chiphi_thucte,
            nd_bd, ng_thuc_hien, dia_diem_bd, quyen_ng_sd, ng_sd, vitri_ts, dv_bd, dia_chi_nha_cung_cap } = req.body;
        let com_id = 0;
        let id_ng_tao = 0;
        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;
            id_ng_tao = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = req.user.data.com_id;
            id_ng_tao = req.user.data.idQLC;
        }

        let date_create = new Date().getTime();
        let maxIDTb = 0;
        let Tb = await ThongBao.findOne({}, {}, { sort: { id_tb: -1 } });
        if (Tb) {
            maxIDTb = Tb.id_tb;
        }
        let insert_thongbao = await ThongBao.findOneAndUpdate({
            id_tb: maxIDTb + 1,
            id_cty: com_id,
            id_ng_nhan: com_id,
            id_ng_tao: id_ng_tao,
            type_quyen: 2,
            type_quyen_tao: type_quyen,
            loai_tb: 5,
            add_or_duyet: 1,
            da_xem: 0,
            date_create: date_create
        });
        let maxIDBD = 0;
        let BD = await BaoDuong.findOne({}, {}, { sort: { id_tb: -1 } });
        if (BD) {
            maxIDBD = BD.id_bd;
        }
        let last_id = maxIDBD + 1;
        let insert_taisan = new BaoDuong({
            id_bd: maxIDBD + 1,
            baoduong_taisan: id_ts,
            bd_sl: sl_bd,
            id_cty: com_id,
            bd_tai_congsuat: cs_bd,
            bd_trang_thai: trang_thai_bd,
            bd_ngay_batdau: ngay_bd,
            bd_dukien_ht: ngay_dukien_ht,
            bd_ngay_ht: ngay_ht_bd,
            bd_noi_dung: nd_bd,
            bd_chiphi_dukien: chiphi_dukien,
            bd_chiphi_thucte: chiphi_thucte,
            bd_ng_thuchien: ng_thuc_hien,
            donvi_bd: dv_bd,
            dia_diem_bd: dia_diem_bd,
            diachi_nha_cc: dia_chi_nha_cung_cap,
            bd_type_quyen: type_quyen,
            bd_id_ng_tao: id_ng_tao,
            bd_ng_sd: ng_sd,
            bd_type_quyen_sd: quyen_ng_sd,
            bd_vi_tri_dang_sd: vitri_ts,
            bd_date_create: date_create
        });
        await insert_taisan.save();
        if (quyen_ng_sd == 1) {
            let taisan = await TaiSan.findOne({ ts_id: id_ts, id_cty: com_id });
            let sl_ts_cu = taisan.ts_so_luong;
            let update_sl = sl_ts_cu - sl_bd;
            let update_taisan = await TaiSan.findOneAndUpdate(
                { ts_id: id_ts, id_cty: com_id },
                {
                    ts_so_luong: update_sl,
                    soluong_cp_bb: update_sl,
                });
            let maxIDQTSD = 0;
            let QTSD = await BaoDuong.findOne({}, {}, { sort: { quatrinh_id: -1 } });
            if (QTSD) {
                maxIDBD = QTSD.quatrinh_id;
            }
            let qr_qtr_sd = new QuaTrinhSuDung({
                quatrinh_id: maxIDBD + 1,
                id_ts: id_ts,
                id_bien_ban: last_id,
                so_lg: sl_bd,
                id_cty: com_id,
                id_cty_sudung: com_id,
                qt_ngay_thuchien: ngay_bd,
                qt_nghiep_vu: 5,
                vitri_ts: vitri_ts,
                ghi_chu: nd_bd,
                time_created: new Date().getTime()
            });
            await qr_qtr_sd.save();
        }
        if (quyen_ng_sd == 2) {
            let taisan = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = taisan.sl_dang_sd;
            let update_sl = sl_ts_cu - sl_bd;
            let maxIDQTSD = 0;
            let QTSD = await BaoDuong.findOne({}, {}, { sort: { quatrinh_id: -1 } });
            if (QTSD) {
                maxIDBD = QTSD.quatrinh_id;
            }
            let qr_qtr_sd = new QuaTrinhSuDung({
                quatrinh_id: maxIDBD + 1,
                id_ts: id_ts,
                id_bien_ban: last_id,
                so_lg: sl_bd,
                id_cty: com_id,
                id_ng_sudung: ng_sd,
                qt_ngay_thuchien: ngay_bd,
                qt_nghiep_vu: 5,
                vitri_ts: vitri_ts,
                ghi_chu: nd_bd,
                time_created: new Date().getTime()
            });
            await qr_qtr_sd.save();

            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate(
                { com_id_sd: com_id, id_ts_sd: id_ts, id_nv_sd: ng_sd }
                , {
                    sl_dang_sd: update_sl
                });
        }
        if (quyen_ng_sd == 3) {
            let taisan = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = taisan.sl_dang_sd;
            let update_sl = sl_ts_cu - sl_bd;
            let maxIDQTSD = 0;
            let QTSD = await BaoDuong.findOne({}, {}, { sort: { quatrinh_id: -1 } });
            if (QTSD) {
                maxIDBD = QTSD.quatrinh_id;
            }
            let qr_qtr_sd = new QuaTrinhSuDung({
                quatrinh_id: maxIDBD + 1,
                id_ts: id_ts,
                id_bien_ban: last_id,
                so_lg: sl_bd,
                id_cty: com_id,
                id_ng_sudung: ng_sd,
                qt_ngay_thuchien: ngay_bd,
                qt_nghiep_vu: 5,
                vitri_ts: vitri_ts,
                ghi_chu: nd_bd,
                time_created: new Date().getTime()
            });
            await qr_qtr_sd.save();
            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate(
                { com_id_sd: com_id, id_ts_sd: id_ts, id_pb_sd: ng_sd }
                , {
                    sl_dang_sd: update_sl
                });
        }

    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);


    }
}



exports.TuChoiBaoDuong = async (req, res) => {
    try {
        let token = req.user;
        console.log("comID: " + token.data.com_id);
        return;
        let { id_bb, content } = req.body;

        let com_id = 0;
        let id_ng_tao = 0;
        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;
            id_ng_tao = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = req.user.data.com_id;
            id_ng_tao = req.user.data.idQLC;
        }
        let tuchoi_bao_duong = await BaoDuong.findOneAndUpdate({
            id_bd: id_bb,
            id_cty: com_id,
        }, {
            bd_trang_thai: 2,
            lydo_tu_choi: content
        });
        let this_baoduong = await BaoDuong.findOne({
            id_cty: com_id,
            id_bd: id_bb
        });
        let ng_sd = this_baoduong.bd_ng_sd;
        let bd_quyen_sd = this_baoduong.bd_type_quyen_sd;
        let sl_bd = this_baoduong.bd_sl;
        let id_ts = this_baoduong.baoduong_taisan;
        let update_taisan = 0;
        if (bd_quyen_sd == 1) {
            let taisan = await TaiSan.findOne({
                id_cty: com_id,
                ts_id: id_ts
            });
            let sl_ts_cu = taisan.ts_so_luong;
            let update_sl = sl_ts_cu + sl_bd;
            update_taisan = await TaiSan.findOneAndUpdate({
                id_cty: com_id,
                ts_id: id_ts
            }, {
                ts_so_luong: update_sl,
                soluong_cp_bb: update_sl
            });
        }
        if (bd_quyen_sd == 2) {
            let taisan = TaiSanDangSuDung.findOne({
                com_id_sd: com_id,
                id_nv_sd: ng_sd,
                id_ts_sd: id_ts
            });
            let sl_ts_cu = taisan.sl_dang_sd;
            let update_sl = sl_ts_cu + sl_bd;
            update_taisan = await TaiSanDangSuDung.findOneAndUpdate({
                com_id_sd: com_id,
                id_ts_sd: id_ts,
                id_nv_sd: ng_sd
            }, {
                sl_dang_sd: update_sl,
            })
        }
        if (bd_quyen_sd == 3) {
            let taisan = await TaiSanDangSuDung.findOne(
                {
                    com_id_sd: com_id,
                    id_pb_sd: ng_sd,
                    id_ts_sd: id_ts
                });
            let sl_ts_cu = taisan.sl_dang_sd;
            let update_sl = sl_ts_cu + sl_bd;
            update_taisan = await TaiSanDangSuDung.findOneAndUpdate({
                com_id_sd: com_id,
                id_ts_sd: id_ts,
                id_pb_sd: ng_sd,
            }, {
                sl_dang_sd: update_sl
            });
        }


        fnc.success(res, [tuchoi_bao_duong, update_taisan]);

    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);
    }
}
