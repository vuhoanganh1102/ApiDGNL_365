const functions = require('../../services/functions');
const Mat = require('../../models/QuanLyTaiSan/Mat');
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao');
const TaiSanDangSD = require('../../models/QuanLyTaiSan/TaiSanDangSuDung');
const QuaTrinhSD = require('../../models/QuanLyTaiSan/QuaTrinhSuDung');


//lay ra danh sach bao mat/ ds cho den bu / ds tai san mat
exports.getListDataLostAssets = async (req,res,next) => {
    try {
        let {page, pageSize, key, dataType} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page-1)*pageSize;
        let id_cty = req.com_id;

        let condition = {id_cty: id_cty, xoa_dx_mat: 0};
        if(key) condition.mat_id = Number(key);

        //dataType = (1, 2, 3): bao cao mat, cho den bu, danh sach mat 
        if(dataType !=1 && dataType !=2 && dataType !=3) return functions.setError(res, "Truyen datatype = 1, 2, 3!", 405);
        if(dataType == 1) condition.mat_trangthai = {$in: [0, 2]};
        if(dataType == 2) condition.mat_trangthai = 3;
        if(dataType == 3) condition.mat_trangthai = 1;
        let danhSachMat = await Mat.aggregate([
            {$match: condition},
            {
                $lookup: {
                    from: "QLTS_Tai_San",
                    localField: "mat_taisan",
                    foreignField: "ts_id",
                    as: "Tai_San"
                }
            },
            { $unwind: { path: "$Tai_San", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "QLTS_Loai_Tai_San",
                    localField: "Tai_San.id_loai_ts",
                    foreignField: "id_loai",
                    as: "Loai_Tai_San"
                }
            },
            { $unwind: { path: "$Loai_Tai_San", preserveNullAndEmptyArrays: true } },
            {$sort: {mat_id: -1}},
            {$skip: skip},
            {$limit: pageSize}
        ]);
        const total = await functions.findCount(Mat, condition);
        return functions.success(res,'get data success',{page, pageSize, total, danhSachMat})
    } catch (error) {
        return functions.setError(res,error.message);
    }
};

//tao moi bien ban mat
exports.createMat = async(req, res, next) => {
    try{
        let {ts_mat, giatri_ts, ycdenbu, ngay_mat, hinhthucdb, sl_mat, ngnhandb, nglammat, phantram_nhap, tiendb,
            day_htdenbu, lydo, giatrimat} = req.body;
        if(ts_mat && ngay_mat && nglammat && sl_mat && lydo && day_htdenbu) {
            let type_quyen_nhan_db = 2;
            let id_cty = req.com_id;
            let id_ng_tao = req.idQLC;
            let type_quyen = req.type;
            ngay_mat = new Date(ngay_mat);
            day_htdenbu = new Date(day_htdenbu);
            let today = new Date(Date.now());
            if(ngay_mat <= today) {
                if(day_htdenbu > ngay_mat && day_htdenbu > today) {
                    let mat_id = await functions.getMaxIdByField(Mat, 'mat_id');
                    let fields = {
                        mat_id: mat_id,
                        id_cty: id_cty, 
                        mat_taisan: ts_mat, 
                        id_ng_lam_mat: nglammat, 
                        id_ng_nhan_denbu: ngnhandb, 
                        id_ng_tao: id_ng_tao, 
                        mat_giatri: giatrimat, 
                        yc_denbu: ycdenbu, 
                        mat_ngay: functions.convertTimestamp(ngay_mat), 
                        hinhthuc_denbu: hinhthucdb, 
                        mat_soluong: sl_mat, 
                        tien_denbu: tiendb, 
                        mat_trangthai: 0, 
                        mat_lydo: lydo,
                        mat_han_ht: day_htdenbu, 
                        pt_denbu: phantram_nhap, 
                        giatri_ts: giatri_ts, 
                        mat_type_quyen: type_quyen, 
                        type_quyen_nhan_db: type_quyen_nhan_db, 
                        mat_date_create: functions.convertTimestamp(today)
                    };
                    let mat = new Mat(fields);
                    mat = await mat.save();

                    if(mat) {
                        let id_tb = await functions.getMaxIdByField(ThongBao, 'id_tb');
                        let fieldsTB = {
                            id_tb: id_tb,
                            id_cty: id_cty,
                            id_ng_nhan: id_cty,
                            id_ng_tao: id_ng_tao,
                            type_quyen: 2,
                            type_quyen_tao: type_quyen,
                            loai_tb: 6,
                            add_or_duyet: 1,
                            da_xem: 0,
                            date_create: functions.convertTimestamp(today)
                        }
                        let thongBao = new ThongBao(fieldsTB);
                        thongBao = await thongBao.save();
                        if(thongBao){
                            return functions.success(res, "Tao bien ban mat thanh cong!");
                        }
                        return functions.setError(res, `Tao thong bao that bai`, 506); 
                    }
                    return functions.setError(res, `Tao mat that bai`, 505); 
                }
                return functions.setError(res, `Ngay den bu < ngay mat or ngay den bu > today`, 406);
            }
            return functions.setError(res, `ngay_mat > today `, 405);
        }
        return functions.setError(res, `Missing input value`, 404);
    }catch(e) {
        return functions.setError(res, e.message);
    }
}


//duyet bao cao mat
exports.duyet = async(req, res, next) => {
    try{
        let {id_mat, id_ng_duyet, type_quyen_duyet, duyet_hinhthuc, duyet_yc, so_tien_nhap, phantram_nhap, day_htdenbu} = req.body;
        let com_id = req.com_id;
        let phantram = 0;
        let so_tien_duyet = 0;
        let ngay_duyet = functions.convertTimestamp(Date.now());
        if(duyet_yc == 0) {
            if(duyet_hinhthuc==0) {
                so_tien_duyet = so_tien_nhap;
            }else {
                so_tien_duyet = so_tien_nhap;
                phantram =  phantram_nhap;
            }
        }
        let mat = await Mat.findOne({mat_id: id_mat, id_cty: com_id});
        if(mat) {
            let quyen_ng_nhan_db = mat.type_quyen_nhan_db;
            let ng_nhan_db = mat.id_ng_nhan_denbu;
            let id_ng_nhan = mat.id_ng_nhan_denbu;
            let id_ts_mat = mat.mat_taisan;
            if(duyet_yc == 1) {
                let update_mat = await Mat.findOneAndUpdate({mat_id: id_mat, id_cty: com_id}, {mat_trangthai: 1}, {new: true});
                // console.log(update_mat)
                if(update_mat) return functions.success(res, "Duyet bien ban mat thanh cong!", {update_mat});
            }else {
                let q_doituong_sd_ts = await TaiSanDangSD.findOne({com_id_sd: com_id, id_ts_sd: id_ts_mat, id_nv_sd: id_ng_nhan}); 
                if(q_doituong_sd_ts) {
                    let sl_ts_dang_sd = q_doituong_sd_ts.sl_dang_sd;
                    let sl_dang_sd_update = sl_ts_dang_sd - mat.mat_soluong;
                    if(sl_dang_sd_update >= 0) {
                        let update_dang_sd = await TaiSanDangSD.findOneAndUpdate({com_id_sd: com_id, id_ts_sd: id_ts_mat, id_nv_sd: id_ng_nhan}, {
                            sl_dang_sd: sl_dang_sd_update
                        });
                        if(update_dang_sd) {
                            let sotien_duyet_cu = mat.so_tien_da_duyet;
                            let sotien_duyet_moi = sotien_duyet_cu + so_tien_duyet;
                            let update_mat = await Mat.findOneAndUpdate({mat_id: id_mat, id_cty: com_id}, {
                                id_ng_duyet: id_ng_duyet,
                                mat_type_quyen_duyet: type_quyen_duyet,
                                hinhthuc_denbu: duyet_hinhthuc,
                                yc_denbu: duyet_yc,
                                pt_denbu: phantram,
                                so_tien_da_duyet: sotien_duyet_moi,
                                mat_trangthai: 3,
                                mat_han_ht: day_htdenbu,
                                ngay_duyet: ngay_duyet,
                            });
                            if(update_mat) {
                                let id_sd = await functions.getMaxIdByField(QuaTrinhSD, 'id_sd');
                                let fieldsQTSD = {
                                    id_sd: id_sd,
                                    id_ts: id_ts_mat,
                                    id_bien_ban: id_mat,
                                    so_lg: mat.mat_soluong,
                                    id_cty: com_id,
                                    qt_ngay_thuchien: mat.mat_ngay,
                                    qt_nghiep_vu: 6,
                                    ghi_chu: mat.mat_lydo,
                                    time_created: ngay_duyet
                                }; 
                                if(quyen_ng_nhan_db == 2) {
                                    fieldsQTSD.id_ng_sudung = id_ng_nhan;
                                }//phong ban
                                else if(quyen_ng_nhan_db == 3){
                                    fieldsQTSD.id_phong_sudung = id_ng_nhan;
                                }
                                
                                let insert_qtsd = new QuaTrinhSD(fieldsQTSD);
                                insert_qtsd = await insert_qtsd.save();
                                if(insert_qtsd) {
                                    let id_tb = await functions.getMaxIdByField(ThongBao, 'id_tb');
                                    let fieldsTB = {
                                        id_tb: id_tb,
                                        id_cty: com_id,
                                        id_ng_nhan: id_ng_nhan,
                                        id_ng_tao: com_id,
                                        type_quyen: quyen_ng_nhan_db,
                                        type_quyen_tao: 2,
                                        loai_tb: 6,
                                        add_or_duyet: 2,
                                        da_xem: 0,
                                        date_create: ngay_duyet
                                    };
                                    let insert_thong_bao = new ThongBao(fieldsTB);
                                    insert_thong_bao = await insert_thong_bao.save();
                                    if(insert_thong_bao) {
                                        return functions.success(res, "Duyet bien ban mat thanh cong!");
                                    }
                                    return functions.setError(res, "Them moi thong bao that bai", 409);
                                }
                                return functions.setError(res, "Them moi qua trinh su dung that bai", 408);
                            }
                        }
                        return functions.setError(res, "Cap nhat tai san dang su dung that bai", 407);
                    }
                    return functions.setError(res, "So luong mat > so luong dang su dung!", 406);
                }
                return functions.setError(res, "Tai san dang su dung khong tim thay!", 405);
            }
            return functions.setError(res, "Duyet bien ban mat that bai!", 506);
        }
        return functions.setError(res, "Bien ban mat khong tim thay!", 405);
    }catch(e){
        return functions.setError(res, e.message);
    }
}

//tu choi bao cao mat
exports.tuChoi = async(req, res, next) => {
    try{
        let com_id = req.com_id;
        let {id_bb, content} = req.body;
        if(id_bb && content) {
            let tuchoi_mat = await Mat.findOneAndUpdate({mat_id: id_bb, id_cty: com_id}, {mat_trangthai: 2, mat_lydo_tuchoi: content}, {new: true});
            if(tuchoi_mat) {
                return functions.success(res, "Tu choi mat thanh cong!");
            }
            return functions.setError(res, "Tu choi mat that bai!", 406); 
        } 
        return functions.setError(res, "Missing input id_bb or content!", 405);
    }catch(e){
        return functions.setError(res, e.message);
    }
}

//xoa danh sach mat
exports.deleteMat = async(req, res, next) => {
    try{
        let {id_bb, datatype} = req.body;
        let type_quyen = req.type;
        let id_ng_xoa = req.idQLC;
        let com_id = req.com_id;
        let date_delete = functions.convertTimestamp(Date.now());
        if(!id_bb) return functions.setError(res, "Missing input id_bb!", 404);
        if(datatype != 1 && datatype != 2 && datatype != 3) return functions.setError(res, "Truyen datatype = 1, 2, 3!", 405);
        if(datatype == 1) {
            let mat = await Mat.findOneAndUpdate({mat_id: id_bb, id_cty: com_id}, {
                xoa_dx_mat: 1, mat_type_quyen_xoa: type_quyen, mat_id_ng_xoa: id_ng_xoa, mat_date_delete: date_delete
            }, {new: true});
            if(mat) return functions.success(res, "Xoa tam thoi thanh cong!");
            return functions.setError(res, "Xoa tam thoi that bai!", 504);
        }
        if(datatype == 2) {
            let mat = await Mat.findOneAndUpdate({mat_id: id_bb, id_cty: com_id}, {
                xoa_dx_mat: 0, mat_type_quyen_xoa: 0, mat_id_ng_xoa: 0, mat_date_delete: ''
            }, {new: true});
            if(mat) return functions.success(res, "Khoi phuc thanh cong!");
            return functions.setError(res, "Khoi phuc that bai!", 504);
        }
        if(datatype == 3) {
            let mat = await Mat.findOneAndDelete({mat_id: id_bb, id_cty: com_id});
            if(mat) return functions.success(res, "Xoa vinh vien thanh cong!");
            return functions.setError(res, "Xoa vinh vien that bai!", 504);
        }
    }catch(e){
        return functions.setError(res, e.message);
    }
}

//hoan thanh den bu
exports.hoanThanh = async(req, res, next) => {
    try{
        let com_id = req.com_id;
        let {id_db, sotien_thanhtoan_nhap, ngay_ht} = req.body;
        if(id_db && sotien_thanhtoan_nhap && ngay_ht) {
            let mat = await Mat.findOne({mat_id: id_db, id_cty: com_id});
            if(mat) {
                let gt_db_conlai = mat.tien_denbu - sotien_thanhtoan_nhap;
                let tien_danhan = mat.sotien_danhan + sotien_thanhtoan_nhap;
                let hoan_thanh_mat = await Mat.findOneAndUpdate({mat_id: id_db, id_cty: com_id}, {
                    mat_trangthai: 1,
                    tien_denbu: gt_db_conlai,
                    sotien_danhan: tien_danhan,
                    ngay_thanhtoan: functions.convertTimestamp(ngay_ht)
                }, {new: true});
                if(hoan_thanh_mat) {
                    return functions.success(res, "Hoan thanh den bu thanh cong!");
                }
                return functions.setError(res, "Den bu that bai!", 407);
            }
            return functions.setError(res, "Khong tim thay thong tin bao mat!", 406);
        } 
        return functions.setError(res, "Missing input id_bb or content!", 405);
    }catch(e){
        return functions.setError(res, e.message);
    }
}