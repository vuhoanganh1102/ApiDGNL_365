const functions = require('../../services/functions');
const hrFunctions = require('../../services/hr/hrService');
const HR_DepartmentDetails = require('../../models/hr/DepartmentDetails');
const axios = require('axios');
const https = require('https');

//cơ cấu tổ chức công ty và phòng ban
exports.detailInfoCompany = async(req, res, next) => {
    try {
        let token = req.body.token
            // let com_id = req.user.data.idQLC
        let com_id = req.body.com_id
        let result = {}
            //thông tin công ty cha

        let infoCompany = await hrFunctions.detailInfoCompany(com_id, token)
        if (infoCompany.result == true) {
            result.infoCompany = infoCompany
        }
        //thông tin phòng ban cha
        let infoDepParent = await HR_DepartmentDetails.find({ comId: com_id, type: 1 })
        if (infoDepParent) {
            result.infoDep = []
            for (let i = 0; i < infoDepParent.length; i++) {
                let depInfo = await hrFunctions.detailInfoDepartment(com_id, infoDepParent[i].depId, token)
                depInfo.depId = infoDepParent[i].depId
                if (infoDepParent[i].description == null) {
                    depInfo.description = "chưa cập nhật"
                } else depInfo.description = infoDepParent[i].description
                result.infoDep.push(depInfo)
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