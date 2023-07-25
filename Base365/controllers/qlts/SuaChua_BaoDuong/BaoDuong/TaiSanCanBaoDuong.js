const fnc = require('../../../../services/functions');
const ThongBao = require('../../../../models/QuanLyTaiSan/ThongBao');
const BaoDuong = require('../../../../models/QuanLyTaiSan/BaoDuong');
const QuaTrinhSuDung = require('../../../../models/QuanLyTaiSan/QuaTrinhSuDung');
const TaiSan = require('../../../../models/QuanLyTaiSan/TaiSan');
const TaiSanDangSuDung = require("../../../../models/QuanLyTaiSan/TaiSanDangSuDung");
const Users = require('../../../../models/Users');
const { errorMonitor } = require('nodemailer/lib/xoauth2');
const Department = require('../../../../models/qlc/Deparment');
const QuyDinhBaoDuong = require('../../../../models/QuanLyTaiSan/Quydinh_bd');
const NhacNho = require('../../../../models/QuanLyTaiSan/NhacNho');
const func = require('../../../../services/QLTS/qltsService');

//add_baoduong
exports.add_Ts_can_bao_duong = async (req, res) => {
    try {
        let { id_ts, sl_bd, trang_thai_bd, cs_bd, ngay_bd, ngay_dukien_ht, ngay_ht_bd, chiphi_dukien, chiphi_thucte,
            nd_bd, ng_thuc_hien, dia_diem_bd, quyen_ng_sd, ng_sd, vitri_ts, dv_bd, dia_chi_nha_cung_cap } = req.body;
        let com_id = 0;
        let id_ng_tao = 0;
        let type_quyen = req.user.data.type;
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
            let QTSD = await QuaTrinhSuDung.findOne({}, {}, { sort: { quatrinh_id: -1 } });
            if (QTSD) {
                maxIDQTSD = QTSD.quatrinh_id;
            }
            let qr_qtr_sd = new QuaTrinhSuDung({
                quatrinh_id: maxIDQTSD + 1,
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
            let QTSD = await QuaTrinhSuDung.findOne({}, {}, { sort: { quatrinh_id: -1 } });
            if (QTSD) {
                maxIDBD = maxIDQTSD.quatrinh_id;
            }
            let qr_qtr_sd = new QuaTrinhSuDung({
                quatrinh_id: maxIDQTSD + 1,
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
            let QTSD = await QuaTrinhSuDung.findOne({}, {}, { sort: { quatrinh_id: -1 } });
            if (QTSD) {
                maxIDBD = maxIDQTSD.quatrinh_id;
            }
            let qr_qtr_sd = new QuaTrinhSuDung({
                quatrinh_id: maxIDQTSD + 1,
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
        fnc.success(res, insert_taisan);

    } catch (error) {

        fnc.setError(res, error.message);

    }
}

//lay ra danh sach can bao duong/ dang bao duong/ da bao duong/ quy dinh bao duong/ theo doi cong suat
exports.danhSachBaoDuong = async (req, res, next) => {
    try {
        let { page, pageSize, key, dataType } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        let com_id = req.user.data.com_id;
        let idQLC = req.user.data.idQLC;
        let type = req.user.data.type;
        let condition = {};
        if (type == 2) {
            condition = { id_cty: com_id, xoa_bd: 0 };
        } else {
            condition = {
                id_cty: com_id, xoa_bd: 0,
                $or: [
                    { bd_id_ng_tao: idQLC },
                    { bd_ng_thuchien: idQLC },
                    { bd_ng_sd: idQLC },
                    { bd_vi_tri_dang_sd: idQLC }
                ]
            };
        }
        if (key) condition.id_bd = key;
        if (dataType != 1 && dataType != 2 && dataType != 3 && dataType != 4 && dataType != 5) return fnc.setError(res, "Truyen dataType = 1, 2, 3, 4, 5");
        //can bao duong
        if (dataType == 1) {
            condition.bd_trang_thai = { $in: [0, 2] };
        }
        //dang bao duong
        else if (dataType == 2) {
            condition.bd_trang_thai = 0;
        }
        //da bao duong
        else if (dataType == 3) {
            condition.bd_trang_thai = 1;
        }
        //quy dinh
        else if (dataType == 4) {
            let condition2 = { id_cty: com_id, qd_xoa: 0 };
            if (type == 2) condition2 = { ...condition2, id_ng_tao_qd: idQLC };
            let quydinh = await fnc.pageFind(QuyDinh, condition2, { qd_id: -1 }, skip, pageSize);
            let total = await fnc.findCount(QuyDinh, condition2);
            return fnc.success(res, "Lay ra danh sach quy dinh bao duong thanh cong", { page, pageSize, total, quydinh });
        }
        //theo doi cong suat
        else if (dataType == 5) {
            let condition2 = { id_cty: com_id, tdcs_xoa: 0 };
            let theoDoiCongSuat = await fnc.pageFind(TheoDoiCongSuat, condition2, { id_cs: -1 }, skip, pageSize);
            let total = await fnc.findCount(TheoDoiCongSuat, condition2);
            return fnc.success(res, "Lay ra danh sach theo doi cong suat thanh cong", { page, pageSize, total, theoDoiCongSuat });
        }

        let listBaoDuong = await fnc.pageFind(BaoDuong, condition, { id_bd: -1 }, skip, pageSize);
        const total = await fnc.findCount(BaoDuong, condition);
        return fnc.success(res, "Lay ra danh sach bao duong thanh cong", { page, pageSize, total, listBaoDuong });
    } catch (e) {
        return fnc.setError(res, e.message);
    }
}

//tu_choi
exports.TuChoiBaoDuong = async (req, res) => {
    try {


        let { id_bb, content } = req.body;

        let com_id = 0;
        let id_ng_tao = 0;
        if (req.user.data.type == 1) {
            com_id = req.user.data.com_id;
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
        if (!this_baoduong) {
            return res.status(400).json({ message: "khong co thong tin cua bien ban nay" });
        }

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


        fnc.success(res, 'sucess', [tuchoi_bao_duong, update_taisan]);

    } catch (error) {

        fnc.setError(res, error.message);
    }
}
//xoa_bd2
exports.delete1 = async (req, res) => {
    try {

        let { datatype, id, } = req.body;
        let com_id = req.user.data.com_id;
        let id_ng_xoa = req.user.data.idQLC;
        let date_delete = new Date().getTime();
        let this_baoduong = await BaoDuong.findOne({
            id_cty: com_id,
            id_bd: id
        });
        let type_quyen = req.user.data.type;
        if (!this_baoduong) {
            return res.status(400).json({ message: "khong co thong tin cua bien ban nay" });
        }

        let ng_sd = this_baoduong.bd_ng_sd;
        let bd_quyen_sd = this_baoduong.bd_type_quyen_sd;
        let sl_bd = this_baoduong.bd_sl;
        let id_ts = this_baoduong.baoduong_taisan;
        let trang_thai_bd = this_baoduong.bd_trang_thai;
        let update_taisan = 0;
        let taisan = 0;
        if (datatype == 1) {
            let baoduong = await BaoDuong.findOneAndUpdate({
                id_bd: id,
                id_cty: com_id
            }, {
                xoa_bd: 1,
                bd_type_quyen_xoa: type_quyen,
                bd_id_ng_xoa: id_ng_xoa,
                bd_date_delete: date_delete
            });
            if (trang_thai_bd == 0) {
                if (bd_quyen_sd == 1) {
                    taisan = await TaiSan.findOne({
                        ts_id: id_ts,
                        id_cty: com_id
                    });
                    let sl_ts_cu = taisan.ts_so_luong;
                    let update_sl = sl_ts_cu + sl_bd;
                    update_taisan = await TaiSan.findOneAndUpdate({
                        id_cty: com_id,
                        ts_id: id_ts
                    }, {
                        ts_so_luong: update_sl,

                    });
                }
                if (bd_quyen_sd == 2) {
                    taisan = await TaiSanDangSuDung.findOne({
                        com_id_sd: com_id,
                        id_nv_sd: ng_sd,
                        id_ts_sd: id_ts
                    });
                    let sl_ts_cu = taisan.sl_dang_sd;
                    let update_sl = sl_ts_cu + sl_bd;
                    update_taisan = await TaiSanDangSuDung.findOneAndUpdate({
                        com_id_sd: com_id,
                        id_nv_sd: ng_sd,
                        id_ts_sd: id_ts
                    }, {
                        sl_dang_sd: update_sl,

                    });
                }
                if (bd_quyen_sd == 3) {
                    taisan = await TaiSanDangSuDung.findOne({
                        com_id_sd: com_id,
                        id_pb_sd: ng_sd,
                        id_ts_sd: id_ts
                    });
                    let sl_ts_cu = taisan.sl_dang_sd;
                    let update_sl = sl_ts_cu + sl_bd;
                    update_taisan = await TaiSanDangSuDung.findOneAndUpdate({
                        com_id_sd: com_id,
                        id_pb_sd: ng_sd,
                        id_ts_sd: id_ts
                    }, {
                        sl_dang_sd: update_sl,

                    });
                }
            }
            fnc.success(res, 'xoa thanh cong ',);
        }
        if (datatype == 2) {
            let khoiphuc = await BaoDuong.findOneAndUpdate({
                id_bd: id,
                id_cty: com_id,
            }, {
                xoa_bd: 0,
                bd_type_quyen_xoa: 0,
                bd_id_ng_xoa: 0,
                bd_date_delete: 0
            });
            if (trang_thai_bd == 0) {
                if (bd_quyen_sd == 1) {
                    taisan = await TaiSan.findOne({
                        ts_id: id_ts,
                        id_cty: com_id
                    });
                    let sl_ts_cu = taisan.ts_so_luong;
                    let update_sl = sl_ts_cu - sl_bd;
                    update_taisan = await TaiSan.findOneAndUpdate({
                        id_cty: com_id,
                        ts_id: id_ts
                    }, {
                        ts_so_luong: update_sl,

                    });
                }
                if (bd_quyen_sd == 2) {
                    taisan = await TaiSanDangSuDung.findOne({
                        com_id_sd: com_id,
                        id_nv_sd: ng_sd,
                        id_ts_sd: id_ts
                    });
                    let sl_ts_cu = taisan.sl_dang_sd;
                    let update_sl = sl_ts_cu - sl_bd;
                    update_taisan = await TaiSanDangSuDung.findOneAndUpdate({
                        com_id_sd: com_id,
                        id_nv_sd: ng_sd,
                        id_ts_sd: id_ts
                    }, {
                        sl_dang_sd: update_sl,

                    });
                }
                if (bd_quyen_sd == 3) {
                    taisan = await TaiSanDangSuDung.findOne({
                        com_id_sd: com_id,
                        id_pb_sd: ng_sd,
                        id_ts_sd: id_ts
                    });
                    let sl_ts_cu = taisan.sl_dang_sd;
                    let update_sl = sl_ts_cu - sl_bd;
                    update_taisan = await TaiSanDangSuDung.findOneAndUpdate({
                        com_id_sd: com_id,
                        id_pb_sd: ng_sd,
                        id_ts_sd: id_ts
                    }, {
                        sl_dang_sd: update_sl,

                    });
                }

            }
            fnc.success(res, 'khoi phuc thanh cong',);
        }
        if (datatype == 3) {
            let xoa_loai = await BaoDuong.findOneAndRemove({
                id_bd: id,
                id_cty: com_id
            });
            fnc.success(res, 'xoa vinh vien thanh cong ');
        }
    } catch (error) {

        fnc.setError(res, error.message);
    }
}
//xoa_all2
exports.deleteAll = async (req, res) => {
    try {
        let { xoa_vinh_vien, array_xoa } = req.body;
        let com_id = req.user.data.com_id;
        let id_ng_xoa = req.user.data.idQLC;
        let xoa = array_xoa.split(',');
        let dem = xoa.length;
        let type_quyen = req.user.data.type;
        if (xoa_vinh_vien == 0 || xoa_vinh_vien == 2) {
            for (let i = 0; i < dem; i++) {


                let this_bd = await BaoDuong.findOne({
                    //   id_cty: com_id,
                    id_bd: xoa[i]
                })

                let ng_sd = this_bd.bd_ng_sd;
                let bd_quyen_sd = this_bd.bd_type_quyen_sd;
                let sl_bd = this_bd.bd_sl;
                let id_ts = this_bd.baoduong_taisan;
                let trang_thai_bd = this_bd.bd_trang_thai;

                let xoa_bao_duong = 0;
                let taisan = 0;
                let update_taisan = 0;
                if (xoa_vinh_vien == 0) {
                    xoa_bao_duong = await BaoDuong.findOneAndUpdate({
                        id_bd: xoa[i],
                        id_cty: com_id,
                    }, {
                        xoa_bd: 1,
                        bd_type_quyen_xoa: type_quyen,
                        bd_id_ng_xoa: id_ng_xoa
                    });
                }
                if (xoa_vinh_vien == 2) {
                    xoa_bao_duong = await BaoDuong.findOneAndUpdate({
                        id_bd: xoa[i],
                        id_cty: com_id,
                    }, {
                        xoa_bd: 0,
                        bd_type_quyen_xoa: 0,
                        bd_id_ng_xoa: 0
                    });
                }



                if (trang_thai_bd == 0) {
                    if (bd_quyen_sd == 1) {
                        taisan = await TaiSan.findOne({
                            id_cty: com_id,
                            ts_id: id_ts
                        });
                        let sl_ts_cu = taisan.ts_so_luong;
                        let update_sl = 0;
                        if (xoa_vinh_vien == 0) {
                            update_sl = sl_ts_cu + sl_bd;
                        }
                        if (xoa_vinh_vien == 2) {
                            update_sl = sl_ts_cu - sl_bd;
                        }

                        update_taisan = await TaiSan.findOneAndUpdate({
                            id_cty: com_id,
                            ts_id: id_ts
                        }, {
                            ts_so_luong: update_sl
                        });
                    }
                    if (bd_quyen_sd == 2) {
                        taisan = await TaiSanDangSuDung.findOne({
                            com_id_sd: com_id,
                            id_nv_sd: ng_sd,
                            id_ts_sd: id_ts
                        });
                        let update_sl = 0;
                        if (xoa_vinh_vien == 0) {
                            update_sl = sl_ts_cu + sl_bd;
                        }
                        if (xoa_vinh_vien == 2) {
                            update_sl = sl_ts_cu - sl_bd;
                        }
                        update_taisan = await TaiSanDangSuDung.findOneAndUpdate({
                            com_id_sd: com_id,
                            id_ts_sd: id_ts,
                            id_nv_sd: ng_sd
                        }, {
                            sl_dang_sd: update_sl
                        });
                    }
                    if (bd_quyen_sd == 3) {
                        taisan = await TaiSanDangSuDung.findOne({
                            com_id_sd: com_id,
                            id_pb_sd: ng_sd,
                            id_ts_sd: id_ts
                        });
                        let update_sl = 0;
                        if (xoa_vinh_vien == 0) {
                            update_sl = sl_ts_cu + sl_bd;
                        }
                        if (xoa_vinh_vien == 2) {
                            update_sl = sl_ts_cu - sl_bd;
                        }
                        update_taisan = await TaiSanDangSuDung.findOneAndUpdate({
                            com_id_sd: com_id,
                            id_pb_sd: ng_sd,
                            id_ts_sd: id_ts
                        }, {
                            sl_dang_sd: update_sl
                        });
                    }
                }
            }
            fnc.success(res, 'thanh cong ')


        } else {
            let xoa_bao_duong = await BaoDuong.findOneAndRemove({
                id_cty: com_id,
                id_bd: { $in: xoa }
            });
            return fnc.success(res, [xoa_bao_duong]);
        }


    } catch (error) {

        fnc.setError(res, error.message);
    }
}
//ts_can_baoduong_chitiet
exports.detailTSCBD = async (req, res) => {
    try {
        let { id_bd } = req.body;
        let com_id = req.user.data.com_id;
        if (isNaN(id_bd)) {
            return res.status(404).json({ message: 'id_bd phai la 1 Numnber' })
        }

        let chitiet_baoduong = await BaoDuong.findOne(
            {

                id_bd: id_bd,
                id_cty: com_id
            }
        );

        let nguoi_tao = await Users.findOne({
            idQLC: chitiet_baoduong.bd_id_ng_tao,
            type: { $ne: 1 }
        });
        let taiSan = await TaiSan.findOne({
            ts_id: chitiet_baoduong.baoduong_taisan
        })
        let nguoi_sd = 0;
        let vi_tri = 0;

        if (chitiet_baoduong.bd_ngay_sudung == 1) {
            let nguoiSD = await Users.findOne({
                idQLC: chitiet_baoduong.bd_ng_sd,
            });
            nguoi_sd = nguoiSD.userName;
            vi_tri = nguoiSD.address;
        }
        else if (chitiet_baoduong.bd_ngay_sudung == 2) {
            let nguoiSD = await Users.findOne({
                idQLC: chitiet_baoduong.bd_ng_sd,
                type: { $ne: 1 }
            });
            nguoi_sd = nguoiSD.userName;
            let phongban = await Department.findOne({ dep_id: nguoiSD.inForPerson.employee.dep_id, com_id: com_id });
            vi_tri = phongban.dep_name;
        }
        else {
            let phongban = await Department.findOne({ dep_id: chitiet_baoduong.bd_ng_sd, com_id: com_id });
            nguoi_sd = vi_tri = phongban.dep_name;
        }


        let infobd = {
            id_bd: chitiet_baoduong.id_bd,
            nguoi_tao: nguoi_tao.userName,
            ngay_tao: new Date(chitiet_baoduong.bd_date_create * 1000),
            bd_trang_thai: chitiet_baoduong.bd_trang_thai,
            ma_ts: chitiet_baoduong.baoduong_taisan,
            ten_ts: taiSan.ts_ten,
            so_luong: chitiet_baoduong.bd_sl,
            doi_tuong_sd: nguoi_sd,
            vi_tri_ts: vi_tri,
            ngay_sd: new Date(chitiet_baoduong.bd_ngay_sudung * 1000),
            ngay_bd_gan_nhat: new Date(chitiet_baoduong.bd_ngay_batdau * 1000),
            ngay_bd_du_kien: new Date(chitiet_baoduong.bd_dukien_ht * 1000),
            bd_tai_congsuat: chitiet_baoduong.bd_tai_congsuat,
            bd_cs_dukien: chitiet_baoduong.bd_cs_dukien,
            noi_dung: chitiet_baoduong.bd_noi_dung
        }
        fnc.success(res, infobd);



    } catch (error) {
        console.log(error)
        fnc.setError(res, error.message);
    }
}

exports.listTSCSC = async (req, res) => {
    try {
        let { key } = req.body;
        let skip = req.body.page || 1;
        let limit = req.bodylimit.limit || 10;
        let com_id = 0;
        let id_ng_tao = 0;
        let type_quyen = req.user.data.type;

        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;
            id_ng_tao = req.user.data.idQLC;
        } else if (req.user.data.type == 2) {
            id_ng_tao = req.user.data.idQLC;
            com_id = req.user.data.com_id;
        }


        let filter = {
            id_cty: com_id,
            xoa_bd: 0

        }
        if (key) {
            filter.id_bd = Number(key);
        }
        let filter2 = {};
        let filter3 = {};
        let filter4 = {};
        let filter5 = {};


        if (type_quyen == 2) {

            filter2.bd_id_ng_tao = id_ng_tao;
            filter3.bd_ng_thuchien = id_ng_tao;
            filter4.bd_ng_sd = id_ng_tao;
            filter5.bd_vi_tri_dang_sd = id_ng_tao;
        }

        let list = await BaoDuong.aggregate([
            {
                $match: {
                    $and: [
                        filter,
                        {
                            $or: [
                                filter2,
                                filter3,
                                filter4,
                                filter5
                            ]
                        },
                        {
                            bd_trang_thai: { $in: [0, 2] }
                        }
                    ]
                }

            }, {
                $skip: (skip - 1) * 10
            },
            {
                $limit: limit
            },
            {
                $sort: {
                    sc_id: -1
                }
            }
        ]);
        let arr_bb = [];
        let count = 0;
        while (count < list.length) {
            let bd_ng_sd = 0;
            let bd_vitri = 0;


            if (list[count].bd_type_quyen_sd == 1) {
                let user = await Users.findOne({ idQLC: list[count].bd_ng_sd });
                bd_ng_sd = user.userName;
                bd_vitri = user.address;
            } else if (list[count].bd_type_quyen_sd == 2) {
                let user = await Users.findOne({ idQLC: list[count].bd_ng_sd, type: { $ne: 1 } });
                bd_ng_sd = user.userName;
                let vitri = await Department.findOne({ dep_id: user.inForPerson.employee.dep_id, com_id: com_id });
                bd_vitri = vitri.dep_name;
            } else {
                let vitri = await Department.findOne({ dep_id: list[count].bd_ng_sd, com_id: com_id });
                bd_ng_sd = vitri.dep_name;
                bd_vitri = vitri.dep_name;
            }
            let taiSan = await TaiSan.findOne({
                ts_id: list[count].baoduong_taisan,
                id_cty: com_id
            })
            let info = {
                id_bd: list[count].id_bd,
                trang_thai_bd: list[count].bd_tai_congsuat,
                ngay_tao: new Date(list[count].bd_date_create * 1000).toLocaleDateString(),
                ma_ts: list[count].baoduong_taisan,
                ten_ts: taiSan.ts_ten,
                so_lg: list[count].bd_sl,
                doi_tg_sd: bd_ng_sd,
                vi_tri_ts: bd_vitri,
                noi_dung: list[count].bd_noi_dung,
            };
            arr_bb.push(info);
            count++;
        }
        fnc.success(res, arr_bb);

    } catch (error) {

        fnc.setError(res, error.message);
    }
}