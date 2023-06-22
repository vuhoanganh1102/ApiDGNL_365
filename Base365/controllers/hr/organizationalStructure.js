const functions = require('../../services/functions');
const hrFunctions = require('../../services/hr/hrService');
const HR_DepartmentDetails = require('../../models/hr/DepartmentDetails');
const axios = require('axios');
const https = require('https');
const Users = require('../../models/Users');
const Deparment = require("../../models/qlc/Deparment")
const Group = require('../../models/qlc/Group');
const Team = require('../../models/qlc/Team');
const HR_NestDetails = require('../../models/hr/NestDetail');
const Tracking = require('../../models/qlc/HisTracking');

//cơ cấu tổ chức công ty, công ty con và phòng ban
exports.detailInfoCompany = async(req, res, next) => {
    try {
        if (req.body.com_id) {
            // let com_id = req.user.data.idQLC
            // hiện đang ko dùng token để test, vì model user chưa có dữ liệu hoàn chỉnh
            let com_id = req.body.com_id
            let shiftID = req.body.shiftID
            let CreateAt = req.body.CreateAt || true
            let inputNew = req.body.inputNew
            let inputOld = req.body.inputOld
            let result = {}
                //thông tin công ty cha
            result.infoCompany = {}
            let infoCompany = await Users.findOne({ idQLC: com_id, type: 1 }, { userName: 1 })

            if (infoCompany) {
                let infoGiamDoc = await Users.findOne({
                    type: 2,
                    "inForPerson.employee.com_id": com_id,
                    "inForPerson.employee.position_id": 8
                }, { userName: 1 })
                let infoPhoGiamDoc = await Users.findOne({
                    type: 2,
                    "inForPerson.employee.com_id": com_id,
                    "inForPerson.employee.position_id": 7
                }, { userName: 1 })
                let countEmp = await Users.countDocuments({
                    type: 2,
                    "inForPerson.employee.com_id": com_id
                })

                let countEmpDD = await Tracking.countDocuments({ companyId: com_id, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } })
                result.infoCompany.parent_com_id = com_id
                result.infoCompany.companyName = infoCompany.userName

                if (infoGiamDoc) {
                    result.infoCompany.parent_manager = infoGiamDoc.userName
                } else result.infoCompany.parent_manager = "Chưa cập nhật"
                if (infoPhoGiamDoc) {
                    result.infoCompany.parent_deputy = infoPhoGiamDoc.userName
                } else result.infoCompany.parent_deputy = "Chưa cập nhật"
                result.infoCompany.tong_nv = countEmp
                result.infoCompany.tong_nv_da_diem_danh = countEmpDD

                //thông tin phòng ban cha
                let infoDepParent = await Deparment.find({ companyId: com_id })

                if (infoDepParent) {
                    result.infoCompany.infoDep = []

                    for (let i = 0; i < infoDepParent.length; i++) {
                        let infoDep = {}
                        infoDep.dep_id = infoDepParent[i]._id
                        infoDep.dep_name = infoDepParent[i].deparmentName
                        let infoTruongphong = await Users.findOne({
                            type: 2,
                            "inForPerson.employee.com_id": com_id,
                            "inForPerson.employee.dep_id": infoDepParent[i]._id,
                            "inForPerson.employee.position_id": 6
                        }, { userName: 1 })

                        if (infoTruongphong) {
                            infoDep.manager = infoTruongphong.userName
                        } else infoDep.manager = "chưa cập nhât"

                        let infoPhophong = await Users.findOne({
                            type: 2,
                            "inForPerson.employee.com_id": com_id,
                            "inForPerson.employee.dep_id": infoDepParent[i]._id,
                            "inForPerson.employee.position_id": 5
                        }, { userName: 1 })

                        if (infoPhophong) {
                            infoDep.deputy = infoPhophong.userName
                        } else infoDep.deputy = "chưa cập nhât"

                        let depInfo = await HR_DepartmentDetails.findOne({ comId: com_id, depId: infoDepParent[i]._id })

                        if (depInfo && depInfo.description != null) {
                            infoDep.description = depInfo.description
                        } else infoDep.description = "chưa cập nhật"

                        let countEmpDep = await Users.countDocuments({
                            type: 2,
                            "inForPerson.employee.com_id": com_id,
                            "inForPerson.employee.dep_id": infoDepParent[i]._id
                        })
                        infoDep.total_emp = countEmpDep

                        let countEmpDepDD = await Tracking.countDocuments({ companyId: com_id, depID: infoDepParent[i]._id, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } })
                        infoDep.tong_nv_da_diem_danh = countEmpDepDD

                        result.infoCompany.infoDep.push(infoDep)

                        //thông tin tổ công ty cha
                        let infoTeamParent = await Team.find({ deparmentId: infoDepParent[i]._id }, { _id: 1, teamName: 1 })
                        result.infoCompany.infoDep[i].infoTeam = []
                        for (let j = 0; j < infoTeamParent.length; j++) {
                            let infoTeamMota = await HR_NestDetails.findOne({ grId: infoTeamParent[j]._id, type: 0, comId: com_id }, { description: 1 })
                            infoTeam = {}
                            infoTeam.gr_id = infoTeamParent[j]._id
                            infoTeam.gr_name = infoTeamParent[j].teamName
                            if (infoTeamMota && infoTeamMota.description != null) {
                                infoTeam.description = infoTeamMota.description
                            } else infoTeam.description = "chưa cập nhật"
                            let infoToTruong = await Users.findOne({
                                type: 2,
                                "inForPerson.employee.com_id": com_id,
                                "inForPerson.employee.dep_id": infoDepParent[i]._id,
                                "inForPerson.employee.position_id": 13,
                                "inForPerson.employee.team_id": infoTeamParent[j]._id
                            }, { userName: 1 })
                            if (infoToTruong) {
                                infoTeam.to_truong = infoToTruong.userName
                            } else infoTeam.to_truong = "chưa cập nhật"

                            let infoPhoToTruong = await Users.findOne({
                                type: 2,
                                "inForPerson.employee.com_id": com_id,
                                "inForPerson.employee.dep_id": infoDepParent[i]._id,
                                "inForPerson.employee.position_id": 12,
                                "inForPerson.employee.team_id": infoTeamParent[j]._id
                            }, { userName: 1 })
                            if (infoPhoToTruong) {
                                infoTeam.pho_to_truong = infoPhoToTruong.userName
                            } else infoTeam.pho_to_truong = "chưa cập nhật"

                            let countEmpTeam = await Users.countDocuments({
                                type: 2,
                                "inForPerson.employee.com_id": com_id,
                                "inForPerson.employee.dep_id": infoDepParent[i]._id,
                                "inForPerson.employee.team_id": infoTeamParent[j]._id
                            })
                            infoTeam.tong_nv = countEmpTeam
                            result.infoCompany.infoDep[i].infoTeam.push(infoTeam)

                            //thông tin nhóm công ty cha
                            let infoGroupParent = await Group.find({ teamId: infoTeamParent[j]._id, depId: infoDepParent[i]._id }, { _id: 1, groupName: 1 })

                            result.infoCompany.infoDep[i].infoTeam[j].infoGroup = []
                            for (let k = 0; k < infoGroupParent.length; k++) {
                                let infoGroupMota = await HR_NestDetails.findOne({ grId: infoGroupParent[k]._id, type: 1, comId: com_id }, { description: 1 })
                                infoGroup = {}
                                infoGroup.gr_id = infoGroupParent[k]._id
                                infoGroup.gr_name = infoGroupParent[k].groupName
                                if (infoGroupMota && infoGroupMota.description != null) {
                                    infoGroup.description = infoGroupMota.description
                                } else infoGroup.description = "chưa cập nhật"
                                let infoNhomTruong = await Users.findOne({
                                    type: 2,
                                    "inForPerson.employee.com_id": com_id,
                                    "inForPerson.employee.dep_id": infoDepParent[i]._id,
                                    "inForPerson.employee.position_id": 4,
                                    "inForPerson.employee.team_id": infoTeamParent[j]._id,
                                    "inForPerson.employee.group_id": infoGroupParent[k]._id
                                }, { userName: 1 })
                                if (infoNhomTruong) {
                                    infoGroup.truong_nhom = infoNhomTruong.userName
                                } else infoGroup.truong_nhom = "chưa cập nhật"

                                let infoPhoNhomTruong = await Users.findOne({
                                    type: 2,
                                    "inForPerson.employee.com_id": com_id,
                                    "inForPerson.employee.dep_id": infoDepParent[i]._id,
                                    "inForPerson.employee.position_id": 20,
                                    "inForPerson.employee.team_id": infoTeamParent[j]._id,
                                    "inForPerson.employee.group_id": infoGroupParent[k]._id
                                }, { userName: 1 })
                                if (infoPhoNhomTruong) {
                                    infoGroup.pho_truong_nhom = infoPhoNhomTruong.userName
                                } else infoGroup.pho_truong_nhom = "chưa cập nhật"

                                let countEmpGroup = await Users.countDocuments({
                                    type: 2,
                                    "inForPerson.employee.com_id": com_id,
                                    "inForPerson.employee.dep_id": infoDepParent[i]._id,
                                    "inForPerson.employee.team_id": infoTeamParent[j]._id,
                                    "inForPerson.employee.group_id": infoGroupParent[k]._id
                                })
                                infoGroup.group_tong_nv = countEmpGroup
                                result.infoCompany.infoDep[i].infoTeam[j].infoGroup.push(infoGroup)

                            }
                        }
                    }
                }

                //thông tin công ty con
                let infoChildCompany = await Users.find({
                    type: 1,
                    "inForCompany.cds.com_parent_id": com_id
                }, { _id: 1, idQLC: 1, userName: 1 })

                if (infoChildCompany) {
                    result.infoCompany.infoChildCompany = []
                    for (let i = 0; i < infoChildCompany.length; i++) {
                        let infochild = {}
                        infochild.com_id = infoChildCompany[i].idQLC
                        let countChildEmp = await Users.countDocuments({
                            type: 2,
                            "inForPerson.employee.com_id": infoChildCompany[i].idQLC
                        })
                        infochild.com_name = infoChildCompany[i].userName
                        infochild.tong_nv = countChildEmp

                        let countChildEmpDD = await Tracking.countDocuments({ companyId: infoChildCompany[i].idQLC, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } })
                        infochild.tong_nv_da_diem_danh = countChildEmpDD

                        let infoChildGiamDoc = await Users.findOne({
                            type: 2,
                            "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                            "inForPerson.employee.position_id": 8
                        }, { userName: 1 })
                        let infoChildPhoGiamDoc = await Users.findOne({
                            type: 2,
                            "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                            "inForPerson.employee.position_id": 7
                        }, { userName: 1 })

                        if (infoChildGiamDoc) {
                            infochild.manager = infoChildGiamDoc.userName
                        } else infochild.manager = "Chưa cập nhật"
                        if (infoChildPhoGiamDoc) {
                            infochild.deputy = infoChildPhoGiamDoc.userName
                        } else infochild.deputy = "Chưa cập nhật"
                        result.infoCompany.infoChildCompany.push(infochild)

                        //thông tin phòng ban con
                        let infoDepChild = await Deparment.find({ companyId: infoChildCompany[i].idQLC })
                        if (infoDepChild) {
                            result.infoCompany.infoChildCompany[i].infoDep = []

                            for (let j = 0; j < infoDepChild.length; j++) {
                                let infoDep = {}
                                infoDep.dep_id = infoDepChild[j]._id
                                infoDep.dep_name = infoDepChild[j].deparmentName
                                let infoTruongphong = await Users.findOne({
                                    type: 2,
                                    "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                    "inForPerson.employee.dep_id": infoDepChild[j]._id,
                                    "inForPerson.employee.position_id": 6
                                }, { userName: 1 })

                                if (infoTruongphong) {
                                    infoDep.manager = infoTruongphong.userName
                                } else infoDep.manager = "chưa cập nhât"

                                let infoPhophong = await Users.findOne({
                                    type: 2,
                                    "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                    "inForPerson.employee.dep_id": infoDepChild[j]._id,
                                    "inForPerson.employee.position_id": 5
                                }, { userName: 1 })

                                if (infoPhophong) {
                                    infoDep.deputy = infoPhophong.userName
                                } else infoDep.deputy = "chưa cập nhât"

                                let depInfo = await HR_DepartmentDetails.findOne({ comId: infoChildCompany[i].idQLC, depId: infoDepChild[i]._id })

                                if (depInfo && depInfo.description != null) {
                                    infoDep.description = depInfo.description

                                } else infoDep.description = "chưa cập nhật"

                                let countEmp = await Users.countDocuments({
                                    type: 2,
                                    "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                    "inForPerson.employee.dep_id": infoDepChild[j]._id
                                })
                                infoDep.tong_nv = countEmp

                                let countEmpDepChildDD = await Tracking.countDocuments({ companyId: infoChildCompany[i].idQLC, depID: infoDepChild[j]._id, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } })

                                infoDep.tong_nv_da_diem_danh = countEmpDepChildDD
                                result.infoCompany.infoChildCompany[i].infoDep.push(infoDep)

                                //thông tin tổ công ty con
                                let infoTeamChild = await Team.find({ deparmentId: infoDepChild[j]._id }, { _id: 1, teamName: 1 })
                                result.infoCompany.infoChildCompany[i].infoDep[j].infoTeam = []
                                for (let k = 0; k < infoTeamChild.length; k++) {
                                    let infoTeamMota = await HR_NestDetails.findOne({
                                        grId: infoTeamChild[k]._id,
                                        type: 0,
                                        comId: infoChildCompany[i].idQLC
                                    }, { description: 1 })
                                    infoTeam = {}
                                    infoTeam.gr_id = infoTeamChild[k]._id
                                    infoTeam.gr_name = infoTeamChild[k].teamName
                                    if (infoTeamMota && infoTeamMota.description != null) {
                                        infoTeam.description = infoTeamMota.description
                                    } else infoTeam.description = "chưa cập nhật"

                                    let infoToTruong = await Users.findOne({
                                        type: 2,
                                        "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                        "inForPerson.employee.dep_id": infoDepChild[j]._id,
                                        "inForPerson.employee.position_id": 13,
                                        "inForPerson.employee.team_id": infoTeamChild[k]._id
                                    }, { userName: 1 })
                                    if (infoToTruong) {
                                        infoTeam.to_truong = infoToTruong.userName
                                    } else infoTeam.to_truong = "chưa cập nhật"

                                    let infoPhoToTruong = await Users.findOne({
                                        type: 2,
                                        "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                        "inForPerson.employee.dep_id": infoDepChild[j]._id,
                                        "inForPerson.employee.position_id": 12,
                                        "inForPerson.employee.team_id": infoTeamChild[k]._id
                                    }, { userName: 1 })
                                    if (infoPhoToTruong) {
                                        infoTeam.pho_to_truong = infoPhoToTruong.userName
                                    } else infoTeam.pho_to_truong = "chưa cập nhật"

                                    let countEmpTeam = await Users.countDocuments({
                                        type: 2,
                                        "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                        "inForPerson.employee.dep_id": infoDepChild[j]._id,
                                        "inForPerson.employee.team_id": infoTeamChild[k]._id
                                    })
                                    infoTeam.tong_nv = countEmpTeam
                                    result.infoCompany.infoChildCompany[i].infoDep[j].infoTeam.push(infoTeam)

                                    //thông tin nhóm công ty con
                                    let infoGroupChild = await Group.find({ teamId: infoTeamChild[k]._id, depId: infoDepChild[j]._id }, { _id: 1, groupName: 1 })
                                    result.infoCompany.infoChildCompany[i].infoDep[j].infoTeam[k].infoGroup = []
                                    for (let l = 0; l < infoGroupChild.length; l++) {
                                        let infoGroupMota = await HR_NestDetails.findOne({ grId: infoGroupChild[k]._id, type: 1, comId: infoChildCompany[i].idQLC }, { description: 1 })
                                        infoGroup = {}
                                        infoGroup.gr_id = infoGroupChild[l]._id
                                        infoGroup.gr_name = infoGroupChild[l].groupName
                                        if (infoGroupMota && infoGroupMota.description != null) {
                                            infoGroup.description = infoGroupMota.description
                                        } else infoGroup.description = "chưa cập nhật"
                                        let infoNhomTruong = await Users.findOne({
                                            type: 2,
                                            "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                            "inForPerson.employee.dep_id": infoDepChild[j]._id,
                                            "inForPerson.employee.position_id": 4,
                                            "inForPerson.employee.team_id": infoTeamChild[k]._id,
                                            "inForPerson.employee.group_id": infoGroupChild[l]._id
                                        }, { userName: 1 })
                                        if (infoNhomTruong) {
                                            infoGroup.truong_nhom = infoNhomTruong.userName
                                        } else infoGroup.truong_nhom = "chưa cập nhật"

                                        let infoPhoNhomTruong = await Users.findOne({
                                            type: 2,
                                            "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                            "inForPerson.employee.dep_id": infoDepChild[j]._id,
                                            "inForPerson.employee.position_id": 20,
                                            "inForPerson.employee.team_id": infoTeamChild[k]._id,
                                            "inForPerson.employee.group_id": infoGroupChild[l]._id
                                        }, { userName: 1 })
                                        if (infoPhoNhomTruong) {
                                            infoGroup.pho_truong_nhom = infoPhoNhomTruong.userName
                                        } else infoGroup.pho_truong_nhom = "chưa cập nhật"

                                        let countEmpGroup = await Users.countDocuments({
                                            type: 2,
                                            "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                            "inForPerson.employee.dep_id": infoDepChild[j]._id,
                                            "inForPerson.employee.team_id": infoTeamChild[k]._id,
                                            "inForPerson.employee.group_id": infoGroupChild[l]._id
                                        })
                                        infoGroup.group_tong_nv = countEmpGroup
                                        result.infoCompany.infoChildCompany[i].infoDep[j].infoTeam[k].infoGroup.push(infoGroup)
                                    }
                                }
                            }
                        }
                    }
                }
            } else return functions.setError(res, "không tìm thấy công ty này", 400);

            return functions.success(res, 'Lấy chi tiết công ty thành công', result);
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi lấy chi tiết công ty", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//hiển thị mô tả chi tiết của phòng ban, tổ trong công ty
exports.description = async(req, res, next) => {
    try {
        if (req.body.comId) {
            // let comId = req.user.data.idQLC
            let comId = Number(req.body.comId)
            let depId = Number(req.body.depId)
            let teamId = Number(req.body.teamId)
            let groupId = Number(req.body.groupId)
            let info

            if (groupId) {
                info = await HR_NestDetails.findOne({ comId: comId, grId: groupId, type: 1 }, { description: 1 })
            }
            if (teamId && !groupId) {
                console.log(1)
                info = await HR_NestDetails.findOne({ comId: comId, grId: teamId, type: 0 }, { description: 1 })
            }
            if (depId && !teamId && !groupId) {

                info = await HR_DepartmentDetails.findOne({ comId: comId, depId: depId }, { description: 1 })
            }
            if (info) {
                return functions.success(res, 'Lấy chi tiết công ty thành công', { info });
            } else return functions.setError(res, "không tìm thấy thông tin", 400);
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi lấy chi tiết công ty", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}

exports.updateDescription = async(req, res, next) => {
    try {
        if (req.body.comId) {
            // let comId = req.user.data.idQLC
            let comId = Number(req.body.comId)
            let depId = Number(req.body.depId)
            let teamId = Number(req.body.teamId)
            let groupId = Number(req.body.groupId)
            let des = req.body.description
            let info

            if (groupId) {
                info = await HR_NestDetails.findOneAndUpdate({ comId: comId, grId: groupId, type: 1 }, { description: des }, { new: true })
            }
            if (teamId && !groupId) {
                console.log(1)
                info = await HR_NestDetails.findOneAndUpdate({ comId: comId, grId: teamId, type: 0 }, { description: des }, { new: true })
            }
            if (depId && !teamId && !groupId) {

                info = await HR_DepartmentDetails.findOneAndUpdate({ comId: comId, depId: depId }, { description: des }, { new: true })
            }
            if (info) {
                return functions.success(res, 'Cập nhật mô tả chi tiết thành công', { info });
            } else return functions.setError(res, "không tìm thấy thông tin", 400);
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi lấy chi tiết công ty", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}