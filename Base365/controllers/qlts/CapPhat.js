const fnc = require('../../services/functions')
const capPhat = require('../../models/QuanLyTaiSan/CapPhat')
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan')
const TaiSanDangSuDung = require('../../models/QuanLyTaiSan/TaiSanDangSuDung')
const thongBao = require('../../models/QuanLyTaiSan/ThongBao')
const dep = require('../../models/qlc/Deparment')
const user = require('../../models/Users')

exports.create = async (req, res) => {
    try {
        const id_cty = req.user.data.idQLC
        const idQLC = req.user.data.idQLC
        const pageNumber = req.body.pageNumber || 1;
        const id_phongban = req.body.id_phongban;
        const cp_lydo = req.body.cp_lydo;
        const cp_trangthai = req.body.cp_trangthai;
        const ts_daidien_nhan = req.body.ts_id;
        const cap_phat_taisan = req.body.cap_phat_taisan;
        const id_ng_thuchien = req.body.id_ng_thuchien;
        const id_ng_daidien = req.body.id_ng_daidien;
        const id_nhanvien = req.body.id_nhanvien;
        const cp_ngay = new Date(req.body.cp_ngay);
        let data = []
        let listItemsType = []
        let soluong_cp_bb = {}
        let max = await capPhat.findOne({}, {}, { sort: { cp_id: -1 } }).lean() || 0;
        let maxThongBao = await thongBao.findOne({}, {}, { sort: { id_tb: -1 } }).lean() || 0;
        let now = new Date()
        if ((cp_lydo && ts_daidien_nhan && id_ng_daidien && id_ng_thuchien)) {
            listItemsType = await TaiSan.find({ id_cty: idQLC }).select('ts_ten soluong_cp_bb').lean()
            if (listItemsType) data.listItemsType = listItemsType
            let listDepartment = await dep.find({ com_id: id_cty }).select('deparmentName').lean()
            let listEmp = await user.find({ "inForPerson.employee.com_id": id_cty, type: 2 }).select('userName').lean()
            if (listDepartment) data.listDepartment = listDepartment
            if (listEmp) data.listEmp = listEmp
            const ds_ts = JSON.parse(cap_phat_taisan).ds_ts;
            const updated_ds_ts = ds_ts.map((item) => ({
                ts_id: item[0],
                sl_cp: item[1]
            }));
            let CapPhatPB = new capPhat({
                //tao cap phat neu la cap phat phong ban thi dien phong ban, neu la cap phat nhan vien thi khong dien id_pb
                cp_id: Number(max.cp_id) + 1 || 1,
                id_nhanvien: id_nhanvien,
                id_phongban: id_phongban,
                cap_phat_taisan: { ds_ts: updated_ds_ts },
                cp_id_ng_tao: idQLC,
                id_cty: id_cty,
                cp_ngay: Date.parse(cp_ngay) / 1000,
                cp_trangthai: cp_trangthai || 0,
                ts_daidien_nhan: ts_daidien_nhan,
                cp_date_create: Date.parse(now) / 1000,
                id_ng_daidien: id_ng_daidien,
                id_ng_thuchien: id_ng_thuchien,
                cp_lydo: cp_lydo,
                cp_da_xoa: 0,
            })
            await CapPhatPB.save()
            data.CapPhatPB = CapPhatPB
            //cap nhat thong bao
            let updateThongBao = new thongBao({
                id_tb: Number(maxThongBao.id_tb) + 1 || 1,
                id_ts: updated_ds_ts[0].ts_id,
                id_cty: id_cty,
                id_ng_tao: idQLC,
                type_quyen: 1,
                type_quyen_tao: 1,
                loai_tb: 1,
                da_xem: 0,
                date_create: Date.parse(now) / 1000,
            })
            await updateThongBao.save()

            return fnc.success(res, " tạo thành công ", { data, CapPhatPB, updateThongBao })

        } else {
            return fnc.setError(res, " cần nhập đủ thông tin ")
        }
    } catch (e) {
        console.log(e);
        return fnc.setError(res, e.message)
    }
}

exports.edit = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id

        const idQLC = req.user.data.idQLC
        const cp_id = req.body.cp_id;
        const id_phongban = req.body.id_phongban;
        const cp_lydo = req.body.cp_lydo;
        const cap_phat_taisan = req.body.cap_phat_taisan;
        const id_ng_thuchien = req.body.id_ng_thuchien;
        const id_ng_daidien = req.body.id_ng_daidien;
        const loai_edit = req.body.loai_edit;
        const id_nhanvien = req.body.id_nhanvien;
        const cp_vitri_sudung = req.body.cp_vitri_sudung;
        const cp_ngay = new Date(req.body.cp_ngay);
        const ds_ts = JSON.parse(cap_phat_taisan).ds_ts;
        const updated_ds_ts = ds_ts.map((item) => ({
            ts_id: item[0],
            sl_cp: item[1]
        }));
        const cap = await capPhat.findOne({ id_cty: id_cty, cp_id: cp_id });

        if (!cap) {
            return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
        } else {
            if (loai_edit == 2) {
                await capPhat.findOneAndUpdate({ id_cty: id_cty, cp_id: cp_id }, {
                    id_cty: id_cty,
                    cap_phat_taisan: { ds_ts: updated_ds_ts },
                    cp_id_ng_tao: idQLC,
                    id_nhanvien: id_nhanvien,
                    id_phongban: id_phongban,
                    id_ng_daidien: id_ng_daidien,
                    id_ng_thuchien: id_ng_thuchien,
                    cp_ngay: Date.parse(cp_ngay) / 1000,
                    cp_vitri_sudung: cp_vitri_sudung,
                    cp_lydo: cp_lydo,
                    cp_id_ng_tao: idQLC,
                })
            } else {
                await capPhat.findOneAndUpdate({ id_cty: id_cty, cp_id: cp_id }, {
                    cp_ngay: Date.parse(cp_ngay) / 1000,
                    cp_lydo: cp_lydo,
                })
            }
            return fnc.success(res, "cập nhật thành công", { cap })
        }
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}

exports.delete = async (req, res) => {
    try {
        const type = req.user.data.type
        const id_cty = ""
        if (type == 1) {
            id_cty = req.user.data.idQLC
        } else {
            id_cty = req.user.data.inForPerson.employee.com_id
        }
        const datatype = req.body.datatype
        const _id = req.body.id
        const type_quyen = req.body.type_quyen
        const id_ng_xoa = req.user.data.idQLC
        const date_delete = new Date()

        if (datatype == 1) {
            const data = await capPhat.findOne({ _id: _id, id_cty: id_cty });
            if (!data) {
                return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            } else {
                await capPhat.findOneAndUpdate({ _id: _id }, {
                    id_cty: id_cty,
                    cp_da_xoa: 1,
                    cp_type_quyen_xoa: type_quyen,
                    cp_id_ng_xoa: id_ng_xoa,
                    cp_date_delete: Date.parse(date_delete),

                })
                    .then((data) => fnc.success(res, "cập nhật thành công", { data }))
                    .catch((err) => fnc.setError(res, err.message, 511));
            }
        }
        if (datatype == 2) {
            const data = await capPhat.findOne({ _id: _id, id_cty: id_cty });
            if (!data) {
                return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            } else {
                await capPhat.findOneAndUpdate({ _id: _id, id_cty: id_cty }, {
                    id_cty: id_cty,
                    cp_da_xoa: 0,
                    cp_type_quyen_xoa: 0,
                    cp_id_ng_xoa: 0,
                    cp_date_delete: 0,

                })
                    .then((data) => fnc.success(res, "cập nhật thành công", { data }))
                    .catch((err) => fnc.setError(res, err.message, 511));
            }
        }
        if (datatype == 3) {
            const deleteonce = await fnc.getDatafindOne(capPhat, { _id: _id, id_cty: id_cty });
            if (!deleteonce) {
                return fnc.setError(res, "không tìm thấy bản ghi", 510);
            } else { //tồn tại thì xóa 
                fnc.getDataDeleteOne(capPhat, { _id: _id })
                    .then(() => fnc.success(res, "xóa thành công!", { deleteonce }))
                    .catch(err => fnc.setError(res, err.message, 512));
            }
        }



    } catch (e) {
        return fnc.setError(res, e.message)
    }
}

// dong y tiep nhan cap phat
exports.updateStatus = async (req, res) => {
    try {
        const type = req.user.data.type
        const id_cty = req.user.data.com_id
        const cp_id = req.body.cp_id
        let listConditions = {};
        if (id_cty) listConditions.id_cty = id_cty
        if (cp_id) listConditions.cp_id = cp_id
        let infoCP = await capPhat.findOne(listConditions)
        if (infoCP.cap_phat_taisan.ds_ts[0].ts_id) {
            let updateQuantity = await TaiSan.findOne({ ts_id: infoCP.cap_phat_taisan.ds_ts[0].ts_id }).lean()
            if (!updateQuantity) {
                return fnc.setError(res, " khong tim thay tai san ")
            } else {//cap nhat so luong tai san 
                await TaiSan.findOneAndUpdate({ ts_id: infoCP.cap_phat_taisan.ds_ts[0].ts_id }, { soluong_cp_bb: (updateQuantity.soluong_cp_bb - infoCP.cap_phat_taisan.ds_ts[0].sl_cp) })
            }
            const data = await capPhat.findOne(listConditions);
            if (!data) {
                return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            } else {
                await capPhat.findOneAndUpdate(listConditions, {
                    cp_trangthai: 1,
                })
                return fnc.success(res, "cập nhật thành công", { data })

            }
        }
        return fnc.setError(res, "khong tim thấy thông tin cấp phát")

    } catch (e) {
        console.log(e);
        return fnc.setError(res, e.message)
    }
}


exports.getListNV = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        const id_nhanvien = req.body.id_nhanvien
        const dep_id = req.body.dep_id
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize);
        const skips = (page - 1) * pageSize;
        const limit = pageSize;
        let data = []
        let numEmp = await capPhat.distinct('id_nhanvien', { id_cty: id_cty, id_nhanvien: { $exists: true }, loai_capphat: 0, cp_da_xoa: 0 })
        if (numEmp) data.push({ numEmp: numEmp.length })
        let numDep = await capPhat.distinct('id_phongban', { id_cty: id_cty, id_nhanvien: { $exists: true }, loai_capphat: 1, cp_da_xoa: 0 })
        if (numDep) data.push({ numDep: numDep.length })
        let listConditions = {};
        listConditions.id_cty = id_cty
        if (id_nhanvien) listConditions.id_nhanvien = Number(id_nhanvien)
        if (dep_id) listConditions.dep_id = Number(dep_id)
        console.log(listConditions)
        // lay danh sach chi tiet phong ban - nhan vien
        let data1 = await capPhat.aggregate([
            { $match: { id_cty: id_cty ,id_nhanvien: {$ne: 0 }} },
            {$sort: {cp_id:-1}},
            {
                $lookup: {
                    from: "QLTS_Tai_San",
                    localField: "cap_phat_taisan.ds_ts.ts_id",
                    foreignField: "ts_id",
                    as: "infoTS"
                }
            },
            { $unwind: "$infoTS" },
            {
                $lookup: {
                    from: "Users",
                    localField: "id_nhanvien",
                    foreignField: "idQLC",
                    as: "infoNguoiDuocCP"
                }
            },
            { $unwind: "$infoNguoiDuocCP" },
            {
                $project: {
                    "cp_id": "$cp_id",
                    "id_cty": "$id_cty",
                    "cap_phat_taisan": "$cap_phat_taisan",
                    "cp_trangthai": "$cp_trangthai",
                    "ts_daidien_nhan": "$ts_daidien_nhan",
                    "id_nhanvien": "$id_nhanvien",
                    "cp_id_ng_tao": "$cp_id_ng_tao",
                    "cp_date_create": "$cp_date_create",
                    "cp_lydo": "$cp_lydo",
                    "ten_nguoi_duoc_cap_phat": "$infoNguoiDuocCP.userName",
                    "dep_id": "$infoNguoiDuocCP.inForPerson.employee.dep_id",
                    "position_id": "$infoNguoiDuocCP.inForPerson.employee.position_id",
                    "ten_tai_san": "$infoTS.ts_ten",
                    "Ma_tai_san": "$infoTS.ts_id",
                    "So_luong_cap_phat": "$cap_phat_taisan.ds_ts.sl_cp",
                }
            },
            { $unwind: "$So_luong_cap_phat" },
            { $match: listConditions },
        ])
        for(let i = 0 ; i<data1.length ; i++){
            let depName = await dep.findOne({com_id:id_cty ,dep_id: data1[i].dep_id})
            data1[i].depName = depName
            let depStatus = await TaiSanDangSuDung.findOne({com_id_sd:id_cty ,id_nv_sd: data1[i].id_nhanvien})
            let total = 0
             if(depStatus) total +=  depStatus.sl_dang_sd
             data1[i].NumCapitalUsing = total 
       }
        data.push({ infoEmp: data1 })
        let count = await capPhat.find(listConditions).count()
        data.push({ NumberEmp: count })
        if (data) {
            return fnc.success(res, " lấy thành công ", { data })
        }
        return fnc.setError(res, "không tìm thấy đối tượng", 510);
    } catch (e) {
        return fnc.setError(res, e.message)
    }
}
exports.getListDep = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        const id_phongban = req.body.id_phongban
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize);
        const skips = (page - 1) * pageSize;
        const limit = pageSize;
        let data = []
        let numEmp = await capPhat.distinct('id_nhanvien', { id_cty: id_cty, id_nhanvien: { $exists: true }, loai_capphat: 0, cp_da_xoa: 0 })
        if (numEmp) data.push({ numEmp: numEmp.length })
        let numDep = await capPhat.distinct('id_phongban', { id_cty: id_cty, id_nhanvien: { $exists: true }, loai_capphat: 1, cp_da_xoa: 0 })
        if (numDep) data.push({ numDep: numDep.length })
        let listConditions = {};
        listConditions.id_cty = id_cty
        if (id_phongban) {
            listConditions.id_phongban = Number(id_phongban)
        } else {
            listConditions.id_phongban = { $exists: true }
        }
        // lay danh sach chi tiet phong ban - nhan vien
        let results1 = []
        let dataDep = await capPhat.aggregate([
            { $match: listConditions },
            {$sort: {cp_id:-1}},
            {
                $lookup: {
                    from: "QLC_Deparments",
                    localField: "id_phongban",
                    foreignField: "dep_id",
                    as: "infoPhongBan"
                }
            },
            { $unwind: "$infoPhongBan" },
            {
                $project: {
                    "cp_id": "$cp_id",
                    "id_cty": "$id_cty",
                    "cp_trangthai": "$cp_trangthai",
                    "id_phongban": "$id_phongban",
                    "dep_name": "$infoPhongBan.dep_name",
                    "manager_id": "$infoPhongBan.manager_id",
                }
            },
        ])
        // .explain("executionStats")
        if (dataDep) {
            for(let i = 0 ; i<dataDep.length ; i++){
                     let depStatus = await TaiSanDangSuDung.findOne({com_id_sd:id_cty ,id_pb_sd: dataDep[i].id_phongban})
                    let total = 0
                     if(depStatus) total +=  depStatus.sl_dang_sd
                    dataDep[i].NumCapitalUsing = total 
                }
            data.push({ dataDep: dataDep })
        }
        if (data) {
            return fnc.success(res, " lấy thành công ", { data })
        }
        return fnc.setError(res, "không tìm thấy đối tượng", 510);
    } catch (e) {
        console.log(e);
        return fnc.setError(res, e.message)
    }
}


exports.getListDetail = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        // const type_quyen = req.body.type_quyen
        let option = req.body.option
        const id_nhanvien = req.body.id_nhanvien
        const id_phongban = req.body.id_phongban
        const cp_id = req.body.cp_id
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let data = {}
        let listConditions = {};
        listConditions.id_cty = id_cty
        // if(id_nhanvien) listConditions.id_nhanvien = id_nhanvien
        // if(id_phongban) listConditions.id_phongban = id_phongban
        // if(cp_id) listConditions.cp_id = cp_id
        if (option == 1) listConditions.cp_trangthai = 0, listConditions.id_nhanvien = Number(id_nhanvien)   ////DS cấp phát chờ nhận NV
        if (option == 2) listConditions.cp_trangthai = 0, listConditions.cp_id = Number(cp_id) ,listConditions.id_nhanvien = Number(id_nhanvien)  ////query cấp phát chờ nhận NV
        if (option == 3) listConditions.cp_trangthai = 1, listConditions.id_nhanvien = Number(id_nhanvien)  //DS đồng ý cấp phát  NV
        if (option == 4) listConditions.cp_trangthai = 1, listConditions.cp_id = Number(cp_id),
        listConditions.id_nhanvien = Number(id_nhanvien)  // query đồng ý cấp phát  NV
        if (option == 5) listConditions.cp_trangthai = 0, listConditions.id_phongban = Number(id_phongban) // DS cấp phát chờ nhận PB
        if (option == 6) listConditions.cp_trangthai = 0, listConditions.cp_id = Number(cp_id) ,listConditions.id_phongban = Number(id_phongban) // query cấp phát chờ nhận PB
        if (option == 7) listConditions.cp_trangthai = 1, listConditions.id_phongban = Number(id_phongban)  //DS đồng ý cấp phát PB
        if (option == 8) listConditions.cp_trangthai = 1, listConditions.cp_id = Number(cp_id) ,listConditions.id_phongban = Number(id_phongban) // query đồng ý cấp phát  PB
        console.log(listConditions)
        data = await capPhat.aggregate([
            { $match: listConditions },
            {
                $lookup: {
                    from: "QLTS_Tai_San",
                    localField: "cap_phat_taisan.ds_ts.ts_id",
                    foreignField: "ts_id",
                    as: "infoTS"
                }
            },
            { $unwind: "$infoTS" },
            {
                $lookup: {
                    from: "Users",
                    localField: "cp_id_ng_tao",
                    foreignField: "idQLC",
                    as: "info"
                }
            },
            { $unwind: "$info" },
            {
                $project: {
                    "cp_id": "$cp_id",
                    "cap_phat_taisan": "$cap_phat_taisan",
                    "cp_trangthai": "$cp_trangthai",
                    "id_nhanvien": "$id_nhanvien",
                    "id_phongban": "$id_phongban",
                    "cp_id_ng_tao": "$cp_id_ng_tao",
                    "cp_date_create": "$cp_date_create",
                    "cp_lydo": "$cp_lydo",
                    "ten_nguoi_tao": "$info.userName",
                    "ten_tai_san": "$infoTS.ts_ten",
                    "Ma_tai_san": "$infoTS.ts_id",
                    "So_luong_cap_phat": "$cap_phat_taisan.ds_ts.sl_cp",
                }
            },
            { $unwind: "$So_luong_cap_phat" },

        ]).skip(skip).limit(limit)
        let count = await capPhat.find(listConditions).count()
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
