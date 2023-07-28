const fnc = require('../../services/functions')
const ThuHoi = require('../../models/QuanLyTaiSan/ThuHoi')
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan')
const QuaTrinhSuDung = require('../../models/QuanLyTaiSan/QuaTrinhSuDung')
const thongBao = require('../../models/QuanLyTaiSan/ThongBao')
const dep = require('../../models/qlc/Deparment')
const user = require('../../models/Users')
const dangSd = require('../../models/QuanLyTaiSan/TaiSanDangSuDung')


exports.create = async (req, res) => {
    try {
        const thuhoi_id = req.user.data.com_id
        const thuhoi_ng_tao = req.user.data.idQLC
        const type_quyen = req.body.type_quyen
        const id_ng_thuhoi = req.body.id_ng_thuhoi
        const id_pb_thuhoi = req.body.id_pb_thuhoi
        const id_ng_dc_thuhoi = req.body.id_ng_dc_thuhoi
        const th_dai_dien_pb = req.body.th_dai_dien_pb
        const thuhoi__lydo = req.body.thuhoi__lydo
        const thuhoi_taisan = req.body.thuhoi_taisan
        const thuhoi_ngay = req.body.thuhoi_ngay
        const thuhoi_soluong = req.body.thuhoi_soluong
        const id_ng_nhan = req.body.id_ng_nhan
        let data = []
        let max = await ThuHoi.findOne({}, {}, { sort: { thuhoi_id: -1 } }).lean() || 0;
        let maxThongBao = await thongBao.findOne({}, {}, { sort: { id_tb: -1 } }).lean() || 0;
        let now = new Date()
        let loai_thuhoi = ""
        if (!id_pb_thuhoi) {
            loai_thuhoi = 0
        }
        else if (!id_ng_dc_thuhoi) {
            loai_thuhoi = 1
        }
        if (type_quyen != 0) {
            if ((thuhoi__lydo && id_ng_thuhoi && thuhoi_taisan && thuhoi_ngay)) {
                let listItems = await TaiSan.find({ id_cty: id_cty }).select('ts_ten soluong_cp_bb').lean()
                let listDepartment = await dep.find({ id_cty: id_cty }).select('deparmentName').lean()
                let listEmp = await user.find({ "inForPerson.employee.com_id": id_cty, type: 2 }).select('userName').lean()
                if (listItems) data.listItems = listItems
                if (listDepartment) data.listDepartment = listDepartment
                if (listEmp) data.listEmp = listEmp
                const ds_thuhoi = JSON.parse(thuhoi_taisan).ds_thuhoi;
                const updated_ds_thuhoi = ds_thuhoi.map((item) => ({
                    ts_id: item[0],
                    sl_th: item[1]
                }));
                //thu hoi nv
                if (loai_thuhoi === 0) {
                    let thuHoiNhanVien = new ThuHoi({
                        thuhoi_id: Number(max.thuhoi_id) + 1 || 1,
                        id_cty: id_cty,
                        id_ng_thuhoi: id_ng_thuhoi,
                        id_ng_dc_thuhoi: id_ng_dc_thuhoi,
                        type_quyen: 2,
                        type_quyen_tao: type_quyen,
                        thuhoi_ng_tao: thuhoi_ng_tao,
                        loai_tb: 1,
                        thuhoi_ngay: thuhoi_ngay,
                        thuhoi_trangthai: 0,
                        add_or_duyet: 0,
                        thuhoi_taisan: { ds_thuhoi: updated_ds_thuhoi },
                        thuhoi__lydo: thuhoi__lydo,
                        thuhoi_soluong: thuhoi_soluong,
                        thuhoi_date_create: Date.parse(now) / 1000,
                        xoa_thuhoi: 0,
                    })
                    await thuHoiNhanVien.save()
                    data.thuHoiNhanVien = thuHoiNhanVien
                    let updateThongBao = new thongBao({
                        id_tb: Number(maxThongBao.id_tb) + 1 || 1,
                        id_ts: updated_ds_thuhoi[0].ts_id,
                        id_cty: id_cty,
                        id_ng_tao: thuhoi_ng_tao,
                        id_ng_nhan: id_ng_nhan,
                        type_quyen: 2,
                        type_quyen_tao: type_quyen,
                        loai_tb: 11,
                        add_or_duyet: 1,
                        da_xem: 0,
                        date_create: Date.parse(now) / 1000,
                    })
                    await updateThongBao.save()
                    return fnc.success(res, " tạo thành công ", { data, thuHoiNhanVien, updateThongBao })

                } else if (loai_thuhoi === 1) {
                    //thu hoi phong ban
                    let thuHoiPhongBan = new ThuHoi({
                        thuhoi_id: Number(max.thuhoi_id) + 1 || 1,
                        id_cty: id_cty,
                        id_ng_thuhoi: id_ng_thuhoi,
                        id_pb_thuhoi: id_pb_thuhoi,
                        th_dai_dien_pb: th_dai_dien_pb,
                        type_quyen: 2,
                        type_quyen_tao: type_quyen,
                        thuhoi_ng_tao: thuhoi_ng_tao,
                        thuhoi_trangthai: 0,
                        loai_tb: 1,
                        thuhoi_ngay: thuhoi_ngay,
                        add_or_duyet: 0,
                        thuhoi_taisan: { ds_thuhoi: updated_ds_thuhoi },
                        thuhoi__lydo: thuhoi__lydo,
                        thuhoi_soluong: thuhoi_soluong,
                        thuhoi_date_create: Date.parse(now) / 1000,
                        xoa_thuhoi: 0,
                    })
                    await thuHoiPhongBan.save()
                    let updateThongBao = new thongBao({
                        id_tb: Number(maxThongBao.id_tb) + 1 || 1,
                        id_ts: updated_ds_thuhoi[0].ts_id,
                        id_cty: id_cty,
                        id_ng_tao: thuhoi_ng_tao,
                        id_ng_nhan: id_ng_nhan,
                        type_quyen: 2,
                        type_quyen_tao: type_quyen,
                        loai_tb: 11,
                        add_or_duyet: 1,
                        da_xem: 0,
                        date_create: Date.parse(now) / 1000,
                    })
                    await updateThongBao.save()
                    return fnc.success(res, " tạo thành công ", { data, thuHoiPhongBan, updateThongBao })

                } else {
                    return fnc.setError(res, " cần nhập đủ thông tin loai_thuhoi")
                }
            } else {
                return fnc.setError(res, " cần nhập đủ thông tin ")
            }
        } else {
            return fnc.setError(res, "bạn chưa có quyền", 510);
        }
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}


//dong y thu hoi 
exports.updateStatus = async (req, res) => {
    try {
        const type = req.user.data.type
        const id_cty = req.user.data.com_id
        const thuhoi_id = req.body.thuhoi_id
        const vitri_ts = req.body.vitri_ts
        const type_thuhoi = req.body.type_thuhoi
        const id_bien_ban = req.body.id_bien_ban
        let listConditions = {};
        let now = new Date()
        if (id_cty) listConditions.id_cty = id_cty
        if (thuhoi_id) listConditions.thuhoi_id = thuhoi_id
        let max = await QuaTrinhSuDung.findOne({}, {}, { sort: { quatrinh_id: -1 } }).lean() || 0;

        let infoCP = await ThuHoi.findOne(listConditions)

        if (infoCP.thuhoi_taisan.ds_thuhoi[0].ts_id) {
            let updateQuantity = await TaiSan.findOne({ ts_id: infoCP.thuhoi_taisan.ds_thuhoi[0].ts_id }).lean()
            if (!updateQuantity) {
                return fnc.setError(res, " khong tim thay tai san ")
            } else {//cap nhat so luong tai san 
                if (type_thuhoi == 0) {

                    await TaiSan.findOneAndUpdate({ ts_id: infoCP.thuhoi_taisan.ds_thuhoi[0].ts_id }, {
                        ts_so_luong: (updateQuantity.ts_so_luong + infoCP.thuhoi_taisan.ds_thuhoi[0].sl_th),
                        soluong_cp_bb: (updateQuantity.soluong_cp_bb + infoCP.thuhoi_taisan.ds_thuhoi[0].sl_th)
                    })

                    let updateQTSD = new QuaTrinhSuDung({
                        quatrinh_id: Number(max.quatrinh_id) + 1 || 1,
                        id_ts: infoCP.thuhoi_taisan.ds_thuhoi[0].ts_id,
                        id_bien_ban: id_bien_ban,
                        so_lg: infoCP.thuhoi_taisan.ds_thuhoi[0].sl_th,
                        id_cty: id_cty,
                        id_ng_sudung: infoCP.id_ng_dc_thuhoi,
                        id_phong_sudung: infoCP.id_pb_thuhoi,
                        qt_ngay_thuchien: Date.parse(now) / 1000,
                        qt_nghiep_vu: 2,
                        vitri_ts: vitri_ts,
                        ghi_chu: infoCP.thuhoi__lydo,
                        time_created: Date.parse(now) / 1000,

                    })
                    await updateQTSD.save()
                } else if (type_thuhoi == 1) {
                    await TaiSan.findOneAndUpdate({ ts_id: infoCP.thuhoi_taisan.ds_thuhoi[0].ts_id }, {
                        ts_so_luong: (updateQuantity.ts_so_luong + infoCP.thuhoi_taisan.ds_thuhoi[0].sl_th),
                        soluong_cp_bb: (updateQuantity.soluong_cp_bb + infoCP.thuhoi_taisan.ds_thuhoi[0].sl_th)
                    })
                    let updateQTSD = new QuaTrinhSuDung({
                        quatrinh_id: Number(max.quatrinh_id) + 1 || 1,
                        id_ts: infoCP.thuhoi_taisan.ds_thuhoi[0].ts_id,
                        id_bien_ban: id_bien_ban,
                        so_lg: infoCP.thuhoi_taisan.ds_thuhoi[0].sl_th,
                        id_cty: id_cty,
                        id_ng_sudung: infoCP.id_ng_dc_thuhoi,
                        id_phong_sudung: infoCP.id_pb_thuhoi,
                        qt_ngay_thuchien: Date.parse(now) / 1000,
                        qt_nghiep_vu: 2,
                        vitri_ts: vitri_ts,
                        ghi_chu: infoCP.thuhoi__lydo,
                        time_created: Date.parse(now) / 1000,

                    })
                    await updateQTSD.save()

                }


            }
        }
        await ThuHoi.findOneAndUpdate(listConditions, {
            thuhoi_trangthai: 1,
        })
        return fnc.success(res, "cập nhật thành công")
        // }
        // return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}


exports.getListDetail = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        // const type_quyen = req.body.type_quyen
        let option = req.body.option
        const thuhoi_id = req.body.thuhoi_id
        const id_pb_thuhoi = req.body.id_pb_thuhoi
        const id_ng_dc_thuhoi = req.body.id_ng_dc_thuhoi
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let data = {}
        let listConditions = {};
        //    if(type_quyen != 0){
        listConditions.id_cty = id_cty
        // if(id_ng_dc_thuhoi) listConditions.id_ng_dc_thuhoi = id_ng_dc_thuhoi
        // if(id_pb_thuhoi) listConditions.id_pb_thuhoi = id_pb_thuhoi
        // if(thuhoi_id) listConditions.thuhoi_id = thuhoi_id
        if (option == 1) listConditions.thuhoi_trangthai = 0, listConditions.id_ng_dc_thuhoi = Number(id_ng_dc_thuhoi)   ////DS thu hôi chờ nhận NV
        if (option == 2) listConditions.thuhoi_trangthai = 0, listConditions.thuhoi_id = Number(thuhoi_id), listConditions.id_ng_dc_thuhoi = Number(id_ng_dc_thuhoi)   ////query thu hôi chờ nhận NV
        if (option == 3) listConditions.thuhoi_trangthai = 1, listConditions.id_ng_dc_thuhoi = Number(id_ng_dc_thuhoi) //DS đồng ý thu hồi  NV
        if (option == 4) listConditions.thuhoi_trangthai = 1, listConditions.thuhoi_id = Number(thuhoi_id), listConditions.id_ng_dc_thuhoi = Number(id_ng_dc_thuhoi)  // đồng ý thu hồi  NV
        if (option == 5) listConditions.thuhoi_trangthai = 0, listConditions.id_pb_thuhoi = Number(id_pb_thuhoi) // DS thu hôi chờ nhận PB
        if (option == 6) listConditions.thuhoi_trangthai = 0, listConditions.thuhoi_id = Number(thuhoi_id), listConditions.id_pb_thuhoi = Number(id_pb_thuhoi)  // //thu hôi chờ nhận PB
        if (option == 7) listConditions.thuhoi_trangthai = 1, listConditions.id_pb_thuhoi = Number(id_pb_thuhoi)  //DS đồng ý thu hồi  PB
        if (option == 8) listConditions.thuhoi_trangthai = 1, listConditions.thuhoi_id = Number(thuhoi_id), listConditions.id_pb_thuhoi = Number(id_pb_thuhoi)  // đồng ý thu hồi  PB
        console.log(listConditions)

        data = await ThuHoi.aggregate([
            { $match: listConditions },
            {
                $lookup: {
                    from: "QLTS_Tai_San",
                    localField: "thuhoi_taisan.ds_thuhoi.ts_id",
                    foreignField: "ts_id",
                    as: "infoTS"
                }
            },
            { $unwind: { path: "$infoTS", preserveNullAndEmptyArrays: true } },

            // {$unwind: "$infoTS"},
            {
                $lookup: {
                    from: "Users",
                    localField: "thuhoi_ng_tao",
                    foreignField: "idQLC",
                    as: "info"
                }
            },
            { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },

            // {$unwind: "$info"},
            {
                $lookup: {
                    from: "Users",
                    localField: "id_ng_dc_thuhoi",
                    foreignField: "idQLC",
                    as: "infoNguoiDuocTH"
                }
            },
            { $unwind: { path: "$infoNguoiDuocTH", preserveNullAndEmptyArrays: true } },

            // {$unwind: "$infoNguoiDuocTH"},
            // {$lookup: {
            //     from: "QLC_Deparments",
            //     localField: "id_pb_thuhoi",
            //     foreignField : "_id",
            //     as : "infoPhongBanTH"
            // }},
            // {$unwind: "$infoPhongBanTH"},
            {
                $project: {
                    "thuhoi_id": "$thuhoi_id",
                    "thuhoi_taisan": "$thuhoi_taisan",
                    "thuhoi_ngay": "$thuhoi_ngay",
                    "id_ng_dc_thuhoi": "$id_ng_dc_thuhoi",
                    "id_pb_thuhoi": "$id_pb_thuhoi",
                    "thuhoi_hoanthanh": "$thuhoi_hoanthanh",
                    "thuhoi_soluong": "$thuhoi_soluong",
                    "thuhoi_ng_tao": "$thuhoi_ng_tao",
                    "thuhoi_trangthai": "$thuhoi_trangthai",
                    "thuhoi__lydo": "$thuhoi__lydo",
                    "ten_nguoi_tao": "$info.userName",
                    "ten_nguoi_TH": "$infoNguoiDuocTH.userName",
                    "ten_tai_san": "$infoTS.ts_ten",
                    "Ma_tai_san": "$infoTS.ts_id",
                    "So_luong_cap_phat": "$thuhoi_taisan.ds_thuhoi.sl_th",
                    // "ten_phong_ban" : "$infoPhongBanTH.dep_name",
                }
            },
            { $unwind: { path: "$So_luong_cap_phat", preserveNullAndEmptyArrays: true } },

            // {$unwind: "$So_luong_cap_phat"},

        ]).skip(skip).limit(limit)
        let count = await ThuHoi.find(listConditions).count()
        if (data) {
            return fnc.success(res, " lấy thành công ", { data, count })
        }
        return fnc.setError(res, "không tìm thấy đối tượng", 510);
        // }
        // return fnc.setError(res, "bạn chưa có quyền", 510);
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}

exports.edit = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        const id_ng_thuhoi = req.user.data.idQLC//id nguoi tao
        // const type_quyen = req.body.type_quyen
        const thuhoi_id = req.body.thuhoi_id;
        const thuhoi_ngay = req.body.thuhoi_ngay;
        const thuhoi_soluong = req.body.thuhoi_soluong;
        const id_ng_dc_thuhoi = req.body.id_ng_dc_thuhoi;
        const thuhoi__lydo = req.body.thuhoi__lydo;
        const loai_edit = req.body.loai_edit
        const data = await ThuHoi.findOne({ thuhoi_id: thuhoi_id, id_cty: id_cty });
        if (!data) {
            return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
        } else {
            if (loai_edit == 2) {
                await ThuHoi.updateOne({ thuhoi_id: thuhoi_id, id_cty: id_cty }, {
                    thuhoi_ngay: thuhoi_ngay,
                    thuhoi_soluong: thuhoi_soluong,
                    thuhoi__lydo: thuhoi__lydo,
                    id_ng_thuhoi: id_ng_thuhoi,
                    id_pb_thuhoi: id_ng_dc_thuhoi,
                    id_ng_dc_thuhoi: id_ng_dc_thuhoi,
                })
                return fnc.success(res, "cập nhật thành công")
            } else {
                await ThuHoi.updateOne({ thuhoi_id: thuhoi_id, id_cty: id_cty }, {
                    thuhoi_ngay: thuhoi_ngay,
                    thuhoi_soluong: thuhoi_soluong,
                    thuhoi__lydo: thuhoi__lydo,
                })
                return fnc.success(res, "cập nhật thành công", { data })
            }
        }
        // }else{
        // return fnc.setError(res, "bạn chưa có quyền", 510);
        //   }
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}

exports.delete = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        const datatype = req.body.datatype
        const _id = req.body.id
        const type_quyen = req.body.type_quyen
        const id_ng_xoa = req.user.data.idQLC
        const date_delete = new Date()
        if (type_quyen != 0) {
            if (datatype == 1) {
                const data = await ThuHoi.findOne({ _id: _id, id_cty: id_cty });
                if (!data) {
                    return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
                } else {
                    await ThuHoi.findOneAndUpdate({ _id: _id }, {
                        id_cty: id_cty,
                        cp_da_xoa: 1,
                        cp_type_quyen_xoa: type_quyen,
                        thuhoi_id_ng_xoa: id_ng_xoa,
                        cp_date_delete: Date.parse(date_delete) / 1000,

                    })
                    return fnc.success(res, "cập nhật thành công", { data })
                }
            }
            if (datatype == 2) {
                const data = await ThuHoi.findOne({ _id: _id, id_cty: id_cty });
                if (!data) {
                    await ThuHoi.findOneAndUpdate({ _id: _id, id_cty: id_cty }, {
                        id_cty: id_cty,
                        cp_da_xoa: 0,
                        cp_type_quyen_xoa: 0,
                        thuhoi_id_ng_xoa: 0,
                        cp_date_delete: 0,

                    })
                    return fnc.success(res, "cập nhật thành công", { data })
                }
                return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật");
            }
            if (datatype == 3) {
                const deleteonce = await fnc.getDatafindOne(ThuHoi, { _id: _id, id_cty: id_cty });
                if (!deleteonce) {
                    return fnc.setError(res, "không tìm thấy bản ghi", 510);
                } else { //tồn tại thì xóa 
                    fnc.getDataDeleteOne(ThuHoi, { _id: _id })
                    return fnc.success(res, "xóa thành công!", { deleteonce })
                }
            }
        } else {
            return fnc.setError(res, "bạn chưa có quyền", 510);
        }
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}

exports.listDetailRecall = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        const thuhoi_id = Number(req.body.thuhoi_id)
        const id_ng_dc_thuhoi = Number(req.body.id_ng_dc_thuhoi)
        const id_pb_thuhoi = Number(req.body.id_pb_thuhoi)
        let filter = {}
        if (thuhoi_id) filter.thuhoi_id = thuhoi_id
        if (id_ng_dc_thuhoi) filter.id_ng_dc_thuhoi = id_ng_dc_thuhoi
        if (id_pb_thuhoi) filter.id_pb_thuhoi = id_pb_thuhoi
        let data = await ThuHoi.aggregate([
            { $match: filter },
            { $sort: { thuhoi_id: -1 } },
            {
                $lookup: {
                    from: "Users",
                    localField: "id_ng_thuhoi",
                    foreignField: "idQLC",
                    as: "info"
                }
            },
            { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "QLTS_Tai_San",
                    localField: "thuhoi_taisan.ds_thuhoi.ts_id",
                    foreignField: "ts_id",
                    as: "infoTS"
                }
            },
            { $unwind: { path: "$infoTS", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "Users",
                    localField: "id_ng_dc_thuhoi",
                    foreignField: "idQLC",
                    as: "infoNguoiDuocCP"
                }
            },
            { $unwind: { path: "$infoNguoiDuocCP", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "QLC_Deparments",
                    localField: "id_pb_thuhoi",
                    foreignField: "dep_id",
                    as: "infoPhongBan"
                }
            },
            { $unwind: { path: "$infoPhongBan", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    "thuhoi_id": "$thuhoi_id",
                    "id_cty": "$id_cty",
                    "thuhoi_taisan": "$thuhoi_taisan",
                    "thuhoi_trangthai": "$thuhoi_trangthai",
                    "id_ng_thuhoi": "$id_ng_thuhoi",
                    "th_dai_dien_pb": "$th_dai_dien_pb",
                    "id_ng_dc_thuhoi": "$id_ng_dc_thuhoi",
                    "thuhoi_id_ng_tao": "$thuhoi_id_ng_tao",
                    "thuhoi_ngay": "$thuhoi_ngay",
                    "thuhoi_hoanthanh": "$thuhoi_hoanthanh",
                    "thuhoi__lydo": "$thuhoi__lydo",
                    "ten_ng_thuhoi": "$info.userName",
                    "ten_nguoi_duoc_th": "$infoNguoiDuocCP.userName",
                    "dep_id": "$infoNguoiDuocCP.inForPerson.employee.dep_id",
                    "position_id": "$infoNguoiDuocCP.inForPerson.employee.position_id",
                    "ten_tai_san": "$infoTS.ts_ten",
                    "Ma_tai_san": "$infoTS.ts_id",
                    "So_luong_th": "$thuhoi_taisan.ds_thuhoi.sl_th",
                    "id_pb_thuhoi": "$id_pb_thuhoi",
                    "dep_name": "$infoPhongBan.dep_name",
                    "manager_id": "$infoPhongBan.manager_id",
                }
            },
            { $unwind: { path: "$So_luong_th", preserveNullAndEmptyArrays: true } },


        ])

        if (data) {
            for (let i = 0; i < data.length; i++) {
                let depName = await dep.findOne({ com_id: id_cty, dep_id: data[i].dep_id })
                data[i].depName = depName
            }
            return fnc.success(res, " lấy thành công ", { data })
        }
        return fnc.setError(res, "không tìm thấy đối tượng", 510);
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}
//Từ chối bàn giao tài sản thu hồi
exports.refuserHandOver = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        const thuhoi_id = req.body.thuhoi_id
        const content = req.body.content
        const data = await ThuHoi.findOne({ thuhoi_id: thuhoi_id, id_cty: id_cty });
        if (!data) {
            return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
        } else {
            await ThuHoi.updateOne({ thuhoi_id: thuhoi_id, id_cty: id_cty }, {
                thuhoi_trangthai: 4,
                th_ly_do_tu_choi_ban_giao: content,
            })
        }
        return fnc.success(res, "cập nhật thành công")
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}
//Từ chối thu hồi tài sản
exports.refuserRecall = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        const thuhoi_id = req.body.thuhoi_id
        const content = req.body.content
        const data = await ThuHoi.findOne({ thuhoi_id: thuhoi_id, id_cty: id_cty });
        if (!data) {
            return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
        } else {
            await ThuHoi.updateOne({ thuhoi_id: thuhoi_id, id_cty: id_cty }, {
                thuhoi_trangthai: 2,
                th_ly_do_tu_choi_ban_giao: content,
            })
        }
        return fnc.success(res, "cập nhật thành công")
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}
//Từ chối nhận tài sản thu hồi
exports.refuserRecallCapital = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        const thuhoi_id = req.body.thuhoi_id
        const content = req.body.content
        const data = await ThuHoi.findOne({ thuhoi_id: thuhoi_id, id_cty: id_cty });
        if (!data) {
            return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
        } else {
            let id_nv = data.id_ng_dc_thuhoi
            let id_pb = data.id_pb_thuhoi
            let sl_th = data.thuhoi_taisan.ds_thuhoi[0].sl_th
            let count = data.thuhoi_taisan.ds_thuhoi[0].ts_id
                for (let t = 0; t < count.length; t++) {
                    if (id_nv != 0) {
                        let sl_dang_sd = await dangSd.findOne({com_id_sd : id_cty, id_nv_sd : id_nv, id_ts_sd: count(t) })
                        let sl_da_cong = sl_dang_sd.sl_dang_sd + sl_th
                        await dangSd.updateOne({ id_ts_sd: count(t), com_id_sd: id_cty ,id_nv_sd : id_nv}, {
                            sl_dang_sd: sl_da_cong,
                        })
                    }
                    if (id_pb != 0) {
                        let sl_dang_sd = await dangSd.findOne({com_id_sd : id_cty, id_pb_sd : id_pb, id_ts_sd: count(t) })
                        let sl_da_cong = sl_dang_sd.sl_dang_sd + sl_th
                        await dangSd.updateOne({ id_ts_sd: count(t), com_id_sd: id_cty ,id_pb_sd : id_pb}, {
                            sl_dang_sd: sl_da_cong,
                        })
                    }
                }
            await ThuHoi.updateOne({ thuhoi_id: thuhoi_id, id_cty: id_cty }, {
                thuhoi_trangthai: 6,
                th_ly_do_tu_choi_ban_giao: content,
            })
        }
        return fnc.success(res, "cập nhật thành công")

    } catch (e) {
        return fnc.setError(res, e.message)
    }
}