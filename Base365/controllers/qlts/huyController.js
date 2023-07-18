const functions = require('../../services/functions')
const Huy = require('../../models/QuanLyTaiSan/Huy');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao');
const TaiSanDangSuDung = require('../../models/QuanLyTaiSan/TaiSanDangSuDung');
const QuaTrinhSuDung = require('../../models/QuanLyTaiSan/QuaTrinhSuDung');


// lấy danh sách đề xuất tài sản huỷ
exports.getDataAssetProposeCancel = async (req, res, next) => {
    try {
        let comId = req.comId || 1763;
        let keywords = req.body.keywords;
        let page = req.body.page;
        let pageSize = req.body.pageSize;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;

        // get data from token
        let quyen = req.quyen;
        let emId = req.emId;

        // declare variables conditions 
        let conditions = {};

        if (quyen === 2) {
            conditions = {
                $or: [
                    { id_ng_tao: emId },
                    { huy_ng_sd: emId },
                ]
            }
        } else if (quyen === 1) {
            conditions = {
                $or: [
                    { id_ng_tao: comId },
                    { huy_ng_sd: comId },
                ]
            }
        }
        if (keywords) conditions.huy_id = keywords;

        conditions.id_cty = comId;
        conditions.huy_trangthai = { $in: [0, 2] };
        conditions.xoa_huy = 0;


        let countDxHuy = await Huy.find(conditions).sort({ huy_id: -1 }).skip(skip).limit(limit).count();

        let countTongDxHuy = await Huy.find(conditions).sort({ huy_id: -1 }).count();

        let listAsset = await TaiSan.find({ id_cty: comId, ts_da_xoa: 0, ts_so_luong: { $gte: 0 } }).sort({ ts_id: -1 });

        let listDxHuy = await Huy.find(conditions).sort({ huy_id: -1 }).skip(skip).limit(limit);



        if (listDxHuy && listDxHuy.huy_taisan && listDxHuy.huy_taisan.ds_huy) {
            let detailAsset = [];
            for (let i = 0; i < listDxHuy.huy_taisan.ds_huy.length; i++) {
                detailAsset = await TaiSan.aggregate([
                    {
                        $match: {
                            id_cty: comId, ts_id: 1800
                        }
                    },
                    {

                        $lookup: {
                            from: 'QLTS_Loai_Tai_San',
                            localField: 'id_loai_ts',
                            foreignField: 'id_loai',
                            as: 'loaiTS'
                        }

                    }
                ]);
                listDxHuy.push(detailAsset)
            }
        }


        conditions.huy_trangthai = 1
        let didCancel = await Huy.find(conditions).count();
        let data = {};
        data.countDxHuy = countDxHuy;
        data.countTongDxHuy = countTongDxHuy;
        data.didCancel = didCancel;
        data.listAsset = listAsset;
        data.listDxHuy = listDxHuy;
        data.detailAsset = detailAsset;
        return functions.success(res, 'get data success', { data })
    }
    catch (error) {
        console.error(error)
        return functions.setError(res, error);
    }
}

// duyệt đề xuất tài sản báo huỷ
exports.approveAssetDisposal = async (req, res, next) => {
    try {
        let comId = Number(req.comId) || 1763;
        let id = Number(req.body.id);
        let ng_duyet = Number(req.body.ng_duyet);
        let type_quyen = Number(req.type);
        let ngay_duyet = new Date().getTime() / 1000;

        // lấy thông tin đề xuất huỷ
        let getData = await Huy.findOne({ huy_id: id, id_cty: comId });

        if (getData) {
            let id_ng_nhan = getData.id_ng_tao;

            let quyen_nhan = getData.huy_type_quyen;

            let huy_ng_sd = getData.huy_ng_sd;

            let huy_quyen_sd = getData.huy_quyen_sd;

            let id_tb = await functions.getMaxIdByField(ThongBao, 'id_tb');

            await ThongBao.create({
                id_tb,
                id_cty: comId,
                id_ng_nhan: id_ng_nhan,
                id_ng_tao: id_cty,
                type_quyen: quyen_nhan,
                type_quyen_tao: 2,
                loai_tb: 7,
                add_or_duyet: 2,
                da_xem: 0,
                date_create: ngay_duyet
            })
            if (getData.huy_taisan) {
                // nhân viên sử dụng
                if (huy_quyen_sd === 2) {
                    let checkUpdate = await TaiSanDangSuDung.findOne(
                        {
                            com_id_sd: comId,
                            id_ts_sd: getData.huy_taisan[0].ds_huy,
                            id_nv_sd: huy_ng_sd
                        })
                    await TaiSanDangSuDung.findOneAndUpdate(
                        {
                            com_id_sd: comId,
                            id_ts_sd: getData.huy_taisan[0].ds_huy,
                            id_nv_sd: huy_ng_sd
                        },
                        {
                            sl_dang_sd: { $inc: -getData.huy_soluong }
                        });
                    if (checkUpdate) {
                        if (checkUpdate.sl_dang_sd > getData.huy_soluong) {

                            await Huy.findOneAndUpdate({ huy_id: id, id_cty: comId },
                                {
                                    id_ng_duyet: ng_duyet,
                                    huy_type_quyen_duyet: type_quyen,
                                    huy_ngayduyet: ngay_duyet,
                                    huy_trangthai: 1
                                });
                            let quatrinh_id = await functions.getMaxIdByField(QuaTrinhSuDung, 'quatrinh_id');
                            await QuaTrinhSuDung.create({
                                quatrinh_id,
                                id_ts: getData.huy_taisan[0].ds_huy,
                                id_bien_ban: id,
                                so_lg: getData.huy_taisan[1].ds_huy,
                                id_cty: comId,
                                id_ng_sudung: huy_ng_sd,
                                qt_ngay_thuchien: getData.huy_ngayduyet,
                                qt_nghiep_vu: 7,
                                ghi_chu: getData.huy_lydo,
                                time_created: ngay_duyet
                            })
                        }
                        return functions.setError(res, 'Số lượng huỷ lớn hơn số lượng hiện sử dụng', 400)
                    }
                    return functions.setError(res, 'Không tìm thấy tài sản đang sử dụng', 404)
                    // phòng ban sử dụng
                } else if (huy_quyen_sd === 3) {
                    let checkUpdate = await TaiSanDangSuDung.findOne(
                        {
                            com_id_sd: comId,
                            id_ts_sd: getData.huy_taisan[0].ds_huy,
                            id_pb_sd: huy_ng_sd
                        })
                    if (checkUpdate) {
                        if (checkUpdate.sl_dang_sd > getData.huy_soluong) {
                            await TaiSanDangSuDung.findOneAndUpdate(
                                {
                                    com_id_sd: comId,
                                    id_ts_sd: getData.huy_taisan[0].ds_huy,
                                    id_pb_sd: huy_ng_sd
                                },
                                {
                                    sl_dang_sd: { $inc: -getData.huy_soluong }
                                });

                            await Huy.findOneAndUpdate({ huy_id: id, id_cty: comId },
                                {
                                    id_ng_duyet: ng_duyet,
                                    huy_type_quyen_duyet: type_quyen,
                                    huy_ngayduyet: ngay_duyet,
                                    huy_trangthai: 1
                                });
                            
                            let quatrinh_id = await functions.getMaxIdByField(QuaTrinhSuDung, 'quatrinh_id');
                            await QuaTrinhSuDung.create({
                                quatrinh_id,
                                id_ts: getData.huy_taisan[0].ds_huy,
                                id_bien_ban: id,
                                so_lg: getData.huy_taisan[1].ds_huy,
                                id_cty: comId,
                                id_phong_sudung: huy_ng_sd,
                                qt_ngay_thuchien: getData.huy_ngayduyet,
                                qt_nghiep_vu: 7,
                                ghi_chu: getData.huy_lydo,
                                time_created: ngay_duyet
                            })
                        }
                        return functions.setError(res, 'Số lượng huỷ lớn hơn số lượng hiện sử dụng', 400)
                    }
                    return functions.setError(res, 'Không tìm thấy tài sản đang sử dụng', 404)
                }
            }
            return functions.setError(res, 'Không tìm thấy tài sản', 404)
        }
        return functions.setError(res, 'Không tìm thấy tài sản đề xuất huỷ', 404)
    } catch (error) {
        return functions.setError(res, error)
    }
}

// từ chối đề xuất tài sản huỷ
exports.rejectAssetDisposal = async (req,res,next)=>{
    try {
        let id_bb = Number(req.body.id_bb);   
        let comId = Number(req.comId); 
        let vitri_tu = Number(req.body.vitri_tu);
        let pb_tu = Number(req.body.pb_tu); 
        let nv_tu = Number(req.body.nv_tu); 
        let content = req.body.content; 
        let tieu_de = req.body.tieu_de; 
        let id_ng_tao = Number(req.body.id_ng_tao); 
        let type_quyen = Number(req.type); 


        
    } catch (error) {
        return functions.setError(res, error)
    }
}