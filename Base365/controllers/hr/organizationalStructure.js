const functions = require('../../services/functions');
const hrFunctions = require('../../services/hr/hrService');
const HR_DepartmentDetails = require('../../models/hr/DepartmentDetails');
const axios = require('axios');
const https = require('https');
const Users = require('../../models/Users');
const Deparment = require("../../models/qlc/Deparment")

//cơ cấu tổ chức công ty, công ty con và phòng ban
exports.detailInfoCompany = async(req, res, next) => {
    try {
        let token = req.body.token
            // let com_id = req.user.data.idQLC
        let com_id = req.body.com_id
        let shiftID = req.body.shiftID
        let CreateAt = req.body.CreateAt || true
        let inputNew = req.body.inputNew
        let inputOld = req.body.inputOld
        let result = {}
            //thông tin công ty cha

        if ((com_id && shiftID) == undefined) {
            functions.setError(res, "lack of input")
        } else if (isNaN(com_id && shiftID)) {
            functions.setError(res, "id must be a Number")
        }

        let infoCompany = await Users.findOne({ idQLC: com_id, type: 1 }, { userName: 1 })
        let infoGiamDoc = await Users.findOne({ type: 2, "inForPerson.employee.com_id": com_id, "inForPerson.employee.position_id": 8 }, { userName: 1 })
        let infoPhoGiamDoc = await Users.findOne({ type: 2, "inForPerson.employee.com_id": com_id, "inForPerson.employee.position_id": 7 }, { userName: 1 })
        let countEmp = await Users.countDocuments({ type: 2, "inForPerson.employee.com_id": com_id })

        if (infoCompany) {
            result.infoCompany.companyName = infoCompany.userName
        } else return functions.setError(res, "không tìm thấy công ty này", 400);
        if (infoGiamDoc) {
            result.infoCompany.giamDoc = infoGiamDoc.userName
        } else result.infoCompany.giamDoc = "Chưa cập nhật"
        if (infoPhoGiamDoc) {
            result.infoCompany.phoGiamDoc = infoPhoGiamDoc.userName
        } else result.infoCompany.phoGiamDoc = "Chưa cập nhật"
        result.infoCompany.soNhanVien = countEmp


        //thông tin phòng ban cha
        let infoDepParent = await Deparment.find({ companyId: com_id })
        if (infoDepParent) {
            result.infoDep = []
            for (let i = 0; i < infoDepParent.length; i++) {
                let infoTruongphong = await Users.findOne({ type: 2, "inForPerson.employee.com_id": com_id, "inForPerson.employee.dep_id": infoDepParent[i]._id, "inForPerson.employee.position_id": 6 }, { userName: 1 })

                if (infoTruongphong) {
                    result.infoDep[i].TruongPhong = infoTruongphong.userName
                } else result.infoDep[i].TruongPhong = "chưa cập nhât"

                let infoPhophong = await Users.findOne({ type: 2, "inForPerson.employee.com_id": com_id, "inForPerson.employee.dep_id": infoDepParent[i]._id, "inForPerson.employee.position_id": 5 }, { userName: 1 })

                if (infoPhophong) {
                    result.infoDep[i].PhoPhong = infoPhophong.userName
                } else result.infoDep[i].PhoPhong = "chưa cập nhât"

                let depInfo = await HR_DepartmentDetails.findOne({ comId: com_id, depId: infoDepParent[i]._id })
                if (infoDepParent[i].description == null) {
                    result.infoDep[i].description = "chưa cập nhật"
                } else result.infoDep[i].description = infoDepParent[i].description
            }
        }
        //thông tin công ty con
        let infoChildCompany = await hrFunctions.detailInfoChildCompany(com_id, token)
        if (infoChildCompany.result == true) {
            result.infoChildCompany = []
            for (let i = 0; i < infoChildCompany.list_nest.length - 1; i++) {
                result.infoChildCompany.push(infoChildCompany.list_nest[i])
            }
        }

        return functions.success(res, 'Lấy chi tiết công ty thành công', result);

    } catch (e) {
        console.log("Đã có lỗi xảy ra khi lấy chi tiết công ty", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}

//cơ cấu tổ chức trong mỗi phòng của công ty
exports.detailInfoNest = async(req, res, next) => {
    try {
        // let com_id = req.user.data.idQLC
        let com_id = req.body.com_id
        let dep_id = req.body.dep_id
        let token = req.body.token
        let result = {}
        result.list_nest = []

        //thông tin tổ theo phòng ban công ty cha
        let nestInfoId = await hrFunctions.showNestByIdDep(com_id, dep_id)
        let nestInfo
        for (let i = 0; i < nestInfoId.list_nest.length; i++) {
            let gr_id = Number(nestInfoId.list_nest[i].gr_id)

            nestInfo = await hrFunctions.detailInfoNest(com_id, gr_id, dep_id, token)
            let nestInfo2 = await HR_DepartmentDetails.findOne({ comId: com_id, gr_id: gr_id, type: 0 })

            if (nestInfo.result == true) {
                result.list_nest[i] = nestInfo.list_nest
                result.list_nest[i].gr_id = gr_id
                if (nestInfo2.description != null) {
                    result.list_nest[i].description = nestInfo2.description
                } else result.list_nest[i].description = "chưa cập nhật"
            }
        }

        return functions.success(res, 'Lấy chi tiết tổ thành công', { result });

    } catch (e) {
        console.log("Đã có lỗi xảy ra khi lấy chi tiết công ty", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}

//hiển thị mô tả chi tiết của phòng ban, tổ trong công ty
exports.description = async(req, res, next) => {
    try {

        // let comId = req.user.data.idQLC
        let comId = req.body.comId
        let depId = req.body.depId
        let nestId = req.body.nestId
        let info

        if (nestId) {
            info = await HR_DepartmentDetails.findOne({ comId: comId, gr_id: nestId, type: 0 }, { description: 1 })
        }
        if (depId) {
            info = await HR_DepartmentDetails.findOne({ comId: comId, type: 1 }, { description: 1 })
        }
        return functions.success(res, 'Lấy chi tiết công ty thành công', { info });

    } catch (e) {
        console.log("Đã có lỗi xảy ra khi lấy chi tiết công ty", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}