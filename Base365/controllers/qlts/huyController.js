const functions = require('../../services/functions')
const Huy = require('../../models/QuanLyTaiSan/Huy');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao');
const TaiSanDangSuDung = require('../../models/QuanLyTaiSan/TaiSanDangSuDung');
const QuaTrinhSuDung = require('../../models/QuanLyTaiSan/QuaTrinhSuDung');
const Users = require('../../models/Users');
const Department = require('../../models/qlc/Deparment');

// tạo đề xuất tài sản huỷ
exports.createAssetProposeCancel = async (req, res, next) => {
    try {
        // khai báo data token
        let comId = req.comId || 1763;
        let type_quyen = Number(req.type) || 1;
        let id_ng_tao = comId;
        let id_ng_dexuat = comId;
        let emId = req.emId;
        if (type_quyen === 2) {
            id_ng_tao = emId;
            id_ng_dexuat = emId;
        }
        // khai báo data người dùng nhập
        let tentshuy = Number(req.body.tentshuy);
        let slhuy = Number(req.body.slhuy);
        let lydohuy = req.body.lydohuy;
        if (tentshuy && slhuy) {
            if (await functions.checkNumber(tentshuy) && await functions.checkNumber(slhuy)) {
                let check = await TaiSan.findOne({ ts_id: tentshuy })
                if (check) {
                    let date = new Date().getTime() / 1000;
                    let huy_id = await functions.getMaxIdByField(Huy, 'huy_id');
                    await Huy.create({
                        huy_id,
                        huy_taisan: tentshuy,
                        id_ng_dexuat: id_ng_dexuat,
                        id_cty: comId,
                        id_ng_tao: id_ng_tao,
                        huy_soluong: slhuy,
                        huy_lydo: lydohuy,
                        huy_type_quyen: type_quyen,
                        huy_date_create: date,
                        huy_ng_sd: 0,
                        huy_quyen_sd: 0,
                    })
                    let id_tb = await functions.getMaxIdByField(ThongBao, 'id_tb');
                    await ThongBao.create({
                        id_tb,
                        id_cty: comId,
                        id_ng_nhan: comId,
                        id_ng_tao: id_ng_tao,
                        type_quyen: 2,
                        type_quyen_tao: type_quyen,
                        loai_tb: 7,
                        add_or_duyet: 1,
                        da_xem: 0,
                        date_create: date
                    })
                    return functions.success(res, 'Tạo đề xuất huỷ tài sản thành công')
                }
                return functions.setError(res, 'Tài sản không tồn tại', 400)
            }
            return functions.setError(res, 'Invalid Number', 400)
        }
        return functions.setError(res, 'Missing data', 400)
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// danh sách đề xuất tài sản huỷ
exports.getDataAssetProposeCancel = async (req, res, next) => {
    try {
        let comId = req.comId || 1763;
        let keywords = Number(req.body.keywords);
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;

        // get data from token
        let quyen = req.type;
        let emId = req.emId;

        // declare variables conditions 
        let conditions = {};
        let detailAsset = [];

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
        if (keywords) conditions.huy_id = { $regex: keywords };

        conditions.id_cty = comId;
        conditions.huy_trangthai = { $in: [0, 2] };
        conditions.xoa_huy = 0;


        let countDxHuy = await Huy.find(conditions).sort({ huy_id: -1 }).skip(skip).limit(limit).count();

        let countTongDxHuy = await Huy.find(conditions).sort({ huy_id: -1 }).count();

        let listAsset = await TaiSan.find({ id_cty: comId, ts_da_xoa: 0, ts_so_luong: { $gte: 0 } }, { ts_ten: 1 }).sort({ ts_id: -1 });

        let listDxHuy = await Huy.find(conditions).sort({ huy_id: -1 }).skip(skip).limit(limit);

        listDxHuy = await Huy.aggregate([
            { $match: conditions },
            { $skip: skip },
            { $limit: limit },
            { $sort: { huy_id: -1 } },
            {
                $lookup: {
                    from: 'QLTS_Tai_San',
                    localField: 'huy_taisan',
                    foreignField: 'ts_id',
                    as: 'taiSan'
                }
            },
            { $unwind: { path: "$taiSan", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'QLTS_Loai_Tai_San',
                    localField: 'taiSan.id_loai_ts',
                    foreignField: 'id_loai',
                    as: 'loaiTS'
                }
            },
            { $unwind: "$loaiTS" },
        ]);
        conditions.huy_trangthai = 1
        let didCancel = await Huy.find(conditions).count();
        let data = {};
        data.countDxHuy = countDxHuy;
        data.countTongDxHuy = countTongDxHuy;
        data.didCancel = didCancel;
        data.listDxHuy = listDxHuy;
        data.listAsset = listAsset;
        return functions.success(res, 'get data success', { data })
    }
    catch (error) {
        console.error(error)
        return functions.setError(res, error);
    }
}

// duyệt đề xuất tài sản huỷ
exports.approveAssetDisposal = async (req, res, next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let comId = Number(req.comId) || 1763;
        let type_quyen = Number(req.type);

        // khai báo biến lấy dữ liệu từ người dùng
        let id = Number(req.body.id);
        let ng_duyet = Number(req.body.ng_duyet);

        // trường lưu thời gian
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
                            id_ts_sd: getData.huy_taisan,
                            id_nv_sd: huy_ng_sd
                        })
                    await TaiSanDangSuDung.findOneAndUpdate(
                        {
                            com_id_sd: comId,
                            id_ts_sd: getData.huy_taisan,
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
                                id_ts: getData.huy_taisan,
                                id_bien_ban: id,
                                so_lg: huy_soluong,
                                id_cty: comId,
                                id_ng_sudung: huy_ng_sd,
                                qt_ngay_thuchien: getData.huy_ngayduyet,
                                qt_nghiep_vu: 7,
                                ghi_chu: getData.huy_lydo,
                                time_created: ngay_duyet
                            })
                            return functions.success(res, 'Duyệt đề xuất huỷ tài sản thành công')
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
                            return functions.success(res, 'Duyệt đề xuất huỷ tài sản thành công')
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
exports.rejectAssetDisposal = async (req, res, next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let comId = Number(req.comId);

        // khai báo biến lấy dữ liệu từ người dùng
        let id_bb = Number(req.body.id_bb);
        let content = req.body.content;

        // logic xử lý
        let check_huy = await Huy.findOne({ huy_id: id_bb, id_cty: comId })
        if (check_huy) {
            await Huy.findByIdAndUpdate(id_bb, {
                huy_trangthai: 2,
                huy_lydo_tuchoi: content
            })
            return functions.success(res, 'Từ chối đề xuất huỷ tài sản thành công')
        }
        return functions.setError(res, 'Không tìm thấy đề xuất huỷ tài sản', 404)
    } catch (error) {
        return functions.setError(res, error)
    }
}

// xoá đề xuất tài sản huỷ
exports.deleteAssetDisposal = async (req, res, next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let type_quyen = Number(req.type);
        let comId = Number(req.comId);
        let emId = Number(req.emId);

        // khai báo id người dùng muốn xoá
        let id = Number(req.body.id);

        // xử lý trường id người xoá
        let id_ng_xoa = comId;
        if (type_quyen === 2) {
            id_ng_xoa = emId;
        }

        // logic xử lý
        let check_huy = await Huy.findOne({ huy_id: id, id_cty: comId })
        if (check_huy) {
            await Huy.findByIdAndUpdate(id, {
                xoa_huy: 1,
                huy_type_quyen_xoa: type_quyen,
                huy_id_ng_xoa: id_ng_xoa,
                huy_date_delete: new Date().getTime() / 1000,
            })
            return functions.success(res, 'Xoá đề xuất huỷ tài sản thành công')
        }
        return functions.setError(res, 'Không tìm thấy đề xuất huỷ tài sản', 400)
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
};

// chi tiết đề xuất tài sản huỷ
exports.detailAssetDisposal = async (req, res, next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let comId = req.comId || 1763;

        // khai báo biến id đề xuất huỷ
        let id = Number(req.query.id);

        // khai báo biến phụ
        let link_url = '';
        let name_link = '';
        // logic xử lý
        if (id) {
            let data = await Huy.aggregate([
                { $match: { huy_id: id, id_cty: comId } },
                {
                    $lookup: {
                        from: 'QLTS_Tai_San',
                        localField: 'huy_taisan',
                        foreignField: 'ts_id',
                        as: 'taiSan'
                    }
                },
                { $unwind: "$taiSan" },
                {
                    $lookup: {
                        from: 'QLTS_Loai_Tai_San',
                        localField: 'taiSan.id_loai_ts',
                        foreignField: 'id_loai',
                        as: 'loaiTS'
                    }
                },
                { $unwind: "$loaiTS" },

            ]);
            data = data[0];
            if (data.huy_trangthai == 0 || data.huy_trangthai == 2) {
                link_url = '/tai-san-dx-huy.html';
                name_link = 'Tài sản đề xuất hủy';
            } else if (data.huy_trangthai == 1 || data.huy_trangthai == 3) {
                link_url = '/dsts-da-huy.html';
                name_link = 'Danh sách tài sản đã hủy';
            }
            data.huy_date_create = new Date(data.huy_date_create * 1000)
            let id_ng_tao = await Users.findOne({ idQLC: data.id_ng_tao }, { userName: 1,inForPerson:1,address:1 });
            data.id_ng_tao = id_ng_tao.userName;
            data.id_ng_dexuat = id_ng_tao.userName;
            data.link_url = link_url;
            data.name_link = name_link;
            if (data.huy_type_quyen === 1) {
              data.vitri = id_ng_tao.address;
              data.doi_tuong_sd = id_ng_tao.userName;
            }else{
                data.doi_tuong_sd = id_ng_tao.userName;
                let dep = await Department.findOne({dep_id:id_ng_tao.inForPerson.employee.dep_id})
                data.phongban = dep.dep_name;
                data.vitri = dep.dep_name;
            }
            return functions.success(res, 'get data success', { data })
        }
        return functions.setError(res, 'missing id', 400)
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// chỉnh sửa đề xuất tài sản huỷ
exports.updateAssetDisposal = async (req,res,next) => {
    try {
        // khai báo biến lấy từ token
        let comId = req.comId || 1763;

        // khai báo biến người dùng nhập vào
        let id = Number(req.body.id);
        let resion = req.body.resion;
        
        // logic xử lý
        if(id){
            let check = await Huy.findOneAndUpdate({huy_id:id,id_cty:comId},{huy_lydo:resion});
            if(check) {
                return functions.success(res,'Chỉnh sửa đề xuất thành công');
            }
            return functions.setError(res,'Không tìm thấy đề xuất',404)
        }
        return functions.setError(res,'missing id',400)
    } catch (error) {
        return functions.setError(res, error)
    }
};