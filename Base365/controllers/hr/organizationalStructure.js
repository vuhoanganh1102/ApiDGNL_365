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
const HR_DescPositions = require('../../models/hr/DescPositions');
const HR_SignatureImages = require('../../models/hr/SignatureImage');
const HR_InfoLeaders = require('../../models/hr/InfoLeaders');
// const Team = require('../../models/qlc/Team');


const positionNames = {
    19: 'Chủ tịch hội đồng quản trị',
    18: 'Phó chủ tịch hội đồng quản trị',
    17: 'Thành viên hội đồng quản trị',
    21: 'Tổng giám đốc tập đoàn',
    22: 'Phó tổng giám đốc tập đoàn',
    16: 'Tổng giám đốc',
    14: 'Phó tổng giám đốc',
    8: 'Giám đốc',
    7: 'Phó giám đốc',
    6: 'Trưởng phòng',
    5: 'Phó trưởng phòng',
    13: 'Tổ trưởng',
    12: 'Phó tổ trưởng',
    4: 'Trưởng nhóm',
    20: 'Nhóm Phó',
    11: 'Trưởng ban dự án',
    10: 'Phó ban dự án',
    3: 'Nhân viên chính thức',
    2: 'Nhân viên thử việc',
    9: 'Nhân viên Part time',
    1: 'Sinh viên thực tập'
};

//cơ cấu tổ chức công ty, công ty con và phòng ban
exports.detailInfoCompany = async (req, res, next) => {
    try {
        if (req.infoLogin) {
            // let com_id = req.infoLogin.comId
            // hiện đang ko dùng token để test, vì model user chưa có dữ liệu hoàn chỉnh
            let com_id = req.infoLogin.comId
            let shiftID = req.body.shiftID
            let CreateAt = req.body.CreateAt || true
            let inputNew = req.body.inputNew
            let inputOld = req.body.inputOld
            let result = {}
            //thông tin công ty cha
            result.infoCompany = {}
            let infoCompany = await Users.findOne({ idQLC: com_id, type: 1 }, { userName: 1 })
            if (infoCompany) {
                result.infoCompany.parent_com_id = com_id
                result.infoCompany.companyName = infoCompany.userName
                const listEmployee = await Users.find({type: 2, "inForPerson.employee.com_id": com_id}, {
                    userName: 1,
                    idQLC: 1,
                    inForPerson: {
                        employee: {
                            com_id: 1,
                            position_id: 1,
                        }
                    }
                });
                let listGiamDoc = listEmployee.filter(employee=> {
                    if(
                        employee.inForPerson &&
                        employee.inForPerson.employee &&
                        employee.inForPerson.employee.position_id === 8
                    ) return true;
                    return false;
                });
                let listPhoGiamDoc = listEmployee.filter(employee=> {
                    if(
                        employee.inForPerson &&
                        employee.inForPerson.employee &&
                        employee.inForPerson.employee.position_id === 7
                    ) return true;
                    return false;
                });
                let countEmpDD = await Tracking.countDocuments({ com_id: com_id})
                // let countEmpDD = await Tracking.countDocuments({ com_id: com_id, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } })
                result.infoCompany.parent_manager = listGiamDoc;
                result.infoCompany.parent_deputy = listPhoGiamDoc;
                result.infoCompany.tong_nv = listEmployee.length;
                result.infoCompany.tong_nv_da_diem_danh = countEmpDD

                //thông tin phòng ban cha
                let infoDepParent = await Deparment.find({ com_id: com_id })

                if (infoDepParent) {
                    result.infoCompany.infoDep = [];

                    for (let i = 0; i < infoDepParent.length; i++) {
                        let infoDep = {manager: []};
                        infoDep.dep_id = infoDepParent[i].dep_id
                        infoDep.dep_name = infoDepParent[i].dep_name
                        let dep_id = infoDepParent[i].dep_id;
                        let infoTruongphong = await Users.findOne({
                            type: 2,
                            "inForPerson.employee.com_id": com_id,
                            "inForPerson.employee.dep_id": infoDepParent[i].dep_id,
                            "inForPerson.employee.position_id": 6
                        }, { userName: 1, idQLC: 1 })
                        if (infoTruongphong) {
                            infoDep.manager = infoTruongphong.userName
                        } else infoDep.manager = "chưa cập nhât"

                        let infoPhophong = await Users.findOne({
                            type: 2,
                            "inForPerson.employee.com_id": com_id,
                            "inForPerson.employee.dep_id": infoDepParent[i].dep_id,
                            "inForPerson.employee.position_id": 5
                        }, { userName: 1, idQLC: 1 })

                        if (infoPhophong) {
                            infoDep.deputy = infoPhophong.userName
                        } else infoDep.deputy = "chưa cập nhât"

                        let depInfo = await HR_DepartmentDetails.findOne({ comId: com_id, depId: infoDepParent[i].dep_id })

                        if (depInfo && depInfo.description != null) {
                            infoDep.description = depInfo.description
                        } else infoDep.description = "chưa cập nhật"

                        let countEmpDep = await Users.countDocuments({
                            type: 2,
                            "inForPerson.employee.com_id": com_id,
                            "inForPerson.employee.dep_id": infoDepParent[i].dep_id
                        })
                        infoDep.total_emp = countEmpDep

                        let countEmpDepDD = await Tracking.countDocuments({ com_id: com_id, dep_id: infoDepParent[i].dep_id, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } })
                        infoDep.tong_nv_da_diem_danh = countEmpDepDD

                        result.infoCompany.infoDep.push(infoDep)

                        //thông tin tổ công ty cha
                        let infoTeamParent = await Team.find({ dep_id: infoDepParent[i].dep_id }, { team_id: 1, teamName: 1 })
                        result.infoCompany.infoDep[i].infoTeam = []
                        for (let j = 0; j < infoTeamParent.length; j++) {
                            let infoTeamMota = await HR_NestDetails.findOne({ grId: infoTeamParent[j].team_id, type: 0, comId: com_id }, { description: 1 })
                            infoTeam = {}
                            infoTeam.gr_id = infoTeamParent[j].team_id
                            infoTeam.gr_name = infoTeamParent[j].teamName
                            if (infoTeamMota && infoTeamMota.description != null) {
                                infoTeam.description = infoTeamMota.description
                            } else infoTeam.description = "chưa cập nhật"
                            let infoToTruong = await Users.findOne({
                                type: 2,
                                "inForPerson.employee.com_id": com_id,
                                "inForPerson.employee.dep_id": infoDepParent[i].dep_id,
                                "inForPerson.employee.position_id": 13,
                                "inForPerson.employee.team_id": infoTeamParent[j].team_id
                            }, { userName: 1 })
                            if (infoToTruong) {
                                infoTeam.to_truong = infoToTruong.userName
                            } else infoTeam.to_truong = "chưa cập nhật"

                            let infoPhoToTruong = await Users.findOne({
                                type: 2,
                                "inForPerson.employee.com_id": com_id,
                                "inForPerson.employee.dep_id": infoDepParent[i].dep_id,
                                "inForPerson.employee.position_id": 12,
                                "inForPerson.employee.team_id": infoTeamParent[j].team_id
                            }, { userName: 1 })
                            if (infoPhoToTruong) {
                                infoTeam.pho_to_truong = infoPhoToTruong.userName
                            } else infoTeam.pho_to_truong = "chưa cập nhật"

                            let countEmpTeam = await Users.countDocuments({
                                type: 2,
                                "inForPerson.employee.com_id": com_id,
                                "inForPerson.employee.dep_id": infoDepParent[i].dep_id,
                                "inForPerson.employee.team_id": infoTeamParent[j].team_id
                            })
                            infoTeam.tong_nv = countEmpTeam
                            result.infoCompany.infoDep[i].infoTeam.push(infoTeam)

                            //thông tin nhóm công ty cha
                            let infoGroupParent = await Group.find({ team_id: infoTeamParent[j].team_id, dep_id: infoDepParent[i].dep_id }, { gr_id: 1, gr_name: 1 })

                            result.infoCompany.infoDep[i].infoTeam[j].infoGroup = []
                            for (let k = 0; k < infoGroupParent.length; k++) {
                                let infoGroupMota = await HR_NestDetails.findOne({ grId: infoGroupParent[k].gr_id, type: 1, comId: com_id }, { description: 1 })
                                infoGroup = {}
                                infoGroup.gr_id = infoGroupParent[k].gr_id
                                infoGroup.gr_name = infoGroupParent[k].gr_name
                                if (infoGroupMota && infoGroupMota.description != null) {
                                    infoGroup.description = infoGroupMota.description
                                } else infoGroup.description = "chưa cập nhật"
                                let infoNhomTruong = await Users.findOne({
                                    type: 2,
                                    "inForPerson.employee.com_id": com_id,
                                    "inForPerson.employee.dep_id": infoDepParent[i].dep_id,
                                    "inForPerson.employee.position_id": 4,
                                    "inForPerson.employee.team_id": infoTeamParent[j].team_id,
                                    "inForPerson.employee.group_id": infoGroupParent[k].gr_id
                                }, { userName: 1 })
                                if (infoNhomTruong) {
                                    infoGroup.truong_nhom = infoNhomTruong.userName
                                } else infoGroup.truong_nhom = "chưa cập nhật"

                                let infoPhoNhomTruong = await Users.findOne({
                                    type: 2,
                                    "inForPerson.employee.com_id": com_id,
                                    "inForPerson.employee.dep_id": infoDepParent[i].dep_id,
                                    "inForPerson.employee.position_id": 20,
                                    "inForPerson.employee.team_id": infoTeamParent[j].team_id,
                                    "inForPerson.employee.group_id": infoGroupParent[k].gr_id
                                }, { userName: 1 })
                                if (infoPhoNhomTruong) {
                                    infoGroup.pho_truong_nhom = infoPhoNhomTruong.userName
                                } else infoGroup.pho_truong_nhom = "chưa cập nhật"

                                let countEmpGroup = await Users.countDocuments({
                                    type: 2,
                                    "inForPerson.employee.com_id": com_id,
                                    "inForPerson.employee.dep_id": infoDepParent[i].dep_id,
                                    "inForPerson.employee.team_id": infoTeamParent[j].team_id,
                                    "inForPerson.employee.group_id": infoGroupParent[k].gr_id
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

                        let countChildEmpDD = await Tracking.countDocuments({ com_id: infoChildCompany[i].idQLC, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } })
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
                        let infoDepChild = await Deparment.find({ com_id: infoChildCompany[i].idQLC })
                        if (infoDepChild) {
                            result.infoCompany.infoChildCompany[i].infoDep = []

                            for (let j = 0; j < infoDepChild.length; j++) {
                                let infoDep = {}
                                infoDep.dep_id = infoDepChild[j].dep_id
                                infoDep.dep_name = infoDepChild[j].dep_name
                                let infoTruongphong = await Users.findOne({
                                    type: 2,
                                    "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                    "inForPerson.employee.dep_id": infoDepChild[j].dep_id,
                                    "inForPerson.employee.position_id": 6
                                }, { userName: 1 })

                                if (infoTruongphong) {
                                    infoDep.manager = infoTruongphong.userName
                                } else infoDep.manager = "chưa cập nhât"

                                let infoPhophong = await Users.findOne({
                                    type: 2,
                                    "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                    "inForPerson.employee.dep_id": infoDepChild[j].dep_id,
                                    "inForPerson.employee.position_id": 5
                                }, { userName: 1 })

                                if (infoPhophong) {
                                    infoDep.deputy = infoPhophong.userName
                                } else infoDep.deputy = "chưa cập nhât"

                                let depInfo = await HR_DepartmentDetails.findOne({ comId: infoChildCompany[i].idQLC, depId: infoDepChild[j].dep_id })

                                if (depInfo && depInfo.description != null) {
                                    infoDep.description = depInfo.description

                                } else infoDep.description = "chưa cập nhật"

                                let countEmp = await Users.countDocuments({
                                    type: 2,
                                    "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                    "inForPerson.employee.dep_id": infoDepChild[j].dep_id
                                })
                                infoDep.tong_nv = countEmp

                                let countEmpDepChildDD = await Tracking.countDocuments({ com_id: infoChildCompany[i].idQLC, dep_id: infoDepChild[j].dep_id, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } })

                                infoDep.tong_nv_da_diem_danh = countEmpDepChildDD
                                result.infoCompany.infoChildCompany[i].infoDep.push(infoDep)

                                //thông tin tổ công ty con
                                let infoTeamChild = await Team.find({ dep_id: infoDepChild[j].dep_id });
                                result.infoCompany.infoChildCompany[i].infoDep[j].infoTeam = []
                                for (let k = 0; k < infoTeamChild.length; k++) {
                                    let infoTeamMota = await HR_NestDetails.findOne({
                                        grId: infoTeamChild[k].team_id,
                                        type: 0,
                                        comId: infoChildCompany[i].idQLC
                                    }, { description: 1 })
                                    infoTeam = {}
                                    infoTeam.gr_id = infoTeamChild[k].team_id
                                    infoTeam.gr_name = infoTeamChild[k].teamName
                                    if (infoTeamMota && infoTeamMota.description != null) {
                                        infoTeam.description = infoTeamMota.description
                                    } else infoTeam.description = "chưa cập nhật"

                                    let infoToTruong = await Users.findOne({
                                        type: 2,
                                        "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                        "inForPerson.employee.dep_id": infoDepChild[j].dep_id,
                                        "inForPerson.employee.position_id": 13,
                                        "inForPerson.employee.team_id": infoTeamChild[k].team_id
                                    }, { userName: 1 })
                                    if (infoToTruong) {
                                        infoTeam.to_truong = infoToTruong.userName
                                    } else infoTeam.to_truong = "chưa cập nhật"

                                    let infoPhoToTruong = await Users.findOne({
                                        type: 2,
                                        "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                        "inForPerson.employee.dep_id": infoDepChild[j].dep_id,
                                        "inForPerson.employee.position_id": 12,
                                        "inForPerson.employee.team_id": infoTeamChild[k].team_id
                                    }, { userName: 1 })
                                    if (infoPhoToTruong) {
                                        infoTeam.pho_to_truong = infoPhoToTruong.userName
                                    } else infoTeam.pho_to_truong = "chưa cập nhật"

                                    let countEmpTeam = await Users.countDocuments({
                                        type: 2,
                                        "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                        "inForPerson.employee.dep_id": infoDepChild[j].dep_id,
                                        "inForPerson.employee.team_id": infoTeamChild[k].team_id
                                    })
                                    infoTeam.tong_nv = countEmpTeam
                                    result.infoCompany.infoChildCompany[i].infoDep[j].infoTeam.push(infoTeam)

                                    //thông tin nhóm công ty con
                                    let infoGroupChild = await Group.find({ team_id: infoTeamChild[k].team_id, dep_id: infoDepChild[j].dep_id })
                                    result.infoCompany.infoChildCompany[i].infoDep[j].infoTeam[k].infoGroup = []
                                    for (let l = 0; l < infoGroupChild.length; l++) {
                                        let infoGroupMota = await HR_NestDetails.findOne({ grId: infoGroupChild[k].gr_id, type: 1, comId: infoChildCompany[i].idQLC }, { description: 1 })
                                        infoGroup = {}
                                        infoGroup.gr_id = infoGroupChild[l].gr_id
                                        infoGroup.gr_name = infoGroupChild[l].groupName
                                        if (infoGroupMota && infoGroupMota.description != null) {
                                            infoGroup.description = infoGroupMota.description
                                        } else infoGroup.description = "chưa cập nhật"
                                        let infoNhomTruong = await Users.findOne({
                                            type: 2,
                                            "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                            "inForPerson.employee.dep_id": infoDepChild[j].dep_id,
                                            "inForPerson.employee.position_id": 4,
                                            "inForPerson.employee.team_id": infoTeamChild[k].team_id,
                                            "inForPerson.employee.group_id": infoGroupChild[l].gr_id
                                        }, { userName: 1 })
                                        if (infoNhomTruong) {
                                            infoGroup.truong_nhom = infoNhomTruong.userName
                                        } else infoGroup.truong_nhom = "chưa cập nhật"

                                        let infoPhoNhomTruong = await Users.findOne({
                                            type: 2,
                                            "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                            "inForPerson.employee.dep_id": infoDepChild[j].dep_id,
                                            "inForPerson.employee.position_id": 20,
                                            "inForPerson.employee.team_id": infoTeamChild[k].team_id,
                                            "inForPerson.employee.group_id": infoGroupChild[l].gr_id
                                        }, { userName: 1 })
                                        if (infoPhoNhomTruong) {
                                            infoGroup.pho_truong_nhom = infoPhoNhomTruong.userName
                                        } else infoGroup.pho_truong_nhom = "chưa cập nhật"

                                        let countEmpGroup = await Users.countDocuments({
                                            type: 2,
                                            "inForPerson.employee.com_id": infoChildCompany[i].idQLC,
                                            "inForPerson.employee.dep_id": infoDepChild[j].dep_id,
                                            "inForPerson.employee.team_id": infoTeamChild[k].team_id,
                                            "inForPerson.employee.group_id": infoGroupChild[l].gr_id
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
exports.description = async (req, res, next) => {
    try {
        if (req.infoLogin) {
            let comId = req.infoLogin.comId;
            let depId = Number(req.body.depId)
            let teamId = Number(req.body.teamId)
            let groupId = Number(req.body.groupId)
            let info

            if (groupId) {
                info = await HR_NestDetails.findOne({ comId: comId, grId: groupId, type: 1 }, { description: 1, id: 1 })
            }
            if (teamId && !groupId) {
                info = await HR_NestDetails.findOne({ comId: comId, grId: teamId, type: 0 }, { description: 1, id: 1 })
            }
            if (depId && !teamId && !groupId) {

                info = await HR_DepartmentDetails.findOne({ comId: comId, depId: depId }, { description: 1, id: 1 })
            }
            if (info && info.description == null) {
                info.description = "chưa cập nhật"
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

exports.updateDescription = async (req, res, next) => {
    try {
        if (req.infoLogin) {
            let comId = req.infoLogin.comId;
            let depId = Number(req.body.depId)
            let teamId = Number(req.body.teamId)
            let groupId = Number(req.body.groupId)
            let des = req.body.description
            let info

            if (groupId) {
                info = await HR_NestDetails.findOneAndUpdate({ comId: comId, grId: groupId, type: 1 }, { description: des }, { new: true })
            }
            if (teamId && !groupId) {
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

//danh sách chức vụ
exports.listPosition = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        //tìm kiếm những chức vụ của công ty đó trong bảng hr
        const arrPosition = [19, 18, 17, 21, 22, 16, 14, 8, 7, 6, 5, 13, 12, 4, 20, 11, 10, 3, 2, 9, 1];
        let listPosition = [];
        //21 chuc vu
        let findUser = await Users.find({
            "inForPerson.employee.com_id": comId
        }, { idQLC: 1, userName: 1, "inForPerson.employee.position_id": 1});

        let position = await HR_DescPositions.find({comId: comId});
        for(let i=0; i<arrPosition.length; i++) {
            listPosition.push({
                positionId: arrPosition[i],
                positionName: positionNames[arrPosition[i]],
                mission: 'Chưa cập nhật',
                users: [],
            });
            for(let j=0; j<position.length; j++) {
                if(position[j] && position[j].positionId == arrPosition[i]) {
                    listPosition[i].mission =  position[j].description;
                }
            }
            
            let users = [];
            for(let j=0; j<findUser.length; j++) {
                if(findUser[j] && findUser[j].inForPerson && findUser[j].inForPerson.employee && findUser[j].inForPerson.employee.position_id == arrPosition[i]) {
                    users.push(findUser[j].userName);
                }
            }
            listPosition[i].users = users;
        }
        let index = listPosition.length-4;
        let data = listPosition.slice(0, index);
        let listPositionEmployee = listPosition.slice(index);
        data.push(listPositionEmployee);
        return functions.success(res, 'Lấy chi tiết công ty thành công', { data });
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi lấy chi tiết công ty", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//chi tiết nhiệm vụ mỗi chức vụ
exports.missionDetail = async (req, res, next) => {
    try {
        if (req.infoLogin) {
            let comId = req.infoLogin.comId;

            let positionId = req.body.positionId
            let mission = await HR_DescPositions.findOne({ comId: comId, positionId: positionId }, { description: 1 })
            if (mission) {
                if (mission.description != null) {
                    return functions.success(res, 'Lấy chi tiết công ty thành công', { mission });
                } else {
                    mission.description = "chưa cập nhật"
                    return functions.success(res, 'Lấy chi tiết công ty thành công', { mission });
                }
            } else return functions.setError(res, "chưa cập nhật nhiệm vụ", 400);
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi lấy chi tiết công ty", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}

//cập nhật chi tiết nhiệm vụ mỗi
exports.updateMission = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;

        let positionId = req.body.positionId
        let description = req.body.description
        if (!positionId || !description) {
            return functions.setError(res, "Missing input value!", 404);
        }
        let mission = await HR_DescPositions.findOne({ comId: comId, positionId: positionId });
        if(mission) {
            mission = await  HR_DescPositions.updateOne({ comId: comId, positionId: positionId }, {description: description }, {new: true});
            if(mission) {
                return functions.success(res, 'cập nhật chi tiết nhiệm vụ thành công', { mission });
            }
        }else {
            let maxId = await functions.getMaxIdByField(HR_DescPositions, 'id');
            mission = new HR_DescPositions({
                id: maxId,
                comId: comId,
                positionId: positionId,
                description: description
            });
            mission = await mission.save();
            if(mission) {
                return functions.success(res, 'cập nhật chi tiết nhiệm vụ thành công', { mission });
            }
        }
        return functions.setError(res, "Update mission fail!", 505);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi lấy chi tiết công ty", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}

//tải lên chữ ký
exports.uploadSignature = async (req, res, next) => {
    try {
        if (req.infoLogin) {
            let empId = req.body.empId

            const maxID = await HR_SignatureImages.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            if (maxID) {
                newIDMax = Number(maxID.id) + 1;
            } else newIDMax = 1
            let file = req.files.signature;
            if (!file) {
                return functions.setError(res, "Missing signature image!", 504);
            }
            if (!await functions.checkImage(file.path)) {
                return functions.setError(res, "Anh khong dung dinh dang hoac qua kich thuoc!", 505);
            }
            let nameFile = await hrFunctions.uploadFileSignature(file);
            let checkSig = await HR_SignatureImages.findOne({ empId: empId })
            if (!checkSig) {
                let upload = new HR_SignatureImages({
                    id: newIDMax,
                    empId: empId,
                    imgName: nameFile,
                    createdAt: new Date(Date.now())
                })
                upload.save()
                if (upload) {
                    return functions.success(res, 'Tải chữ ký thành công');
                }
            } else return functions.setError(res, "Đã tồn tại chữ ký của người này", 400);

        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi tải lên hồ sơ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//xóa chữ kí đã tải lên
exports.deleteSignature = async (req, res, next) => {
    try {
        if (req.infoLogin) {
            let empId = req.body.empId
            let deleteSig = await HR_SignatureImages.findOneAndUpdate({ empId: empId }, { isDelete: 1, deletedAt: new Date(Date.now()) })

            if (deleteSig) {
                return functions.success(res, 'Xóa chữ ký thành công');
            }
            return functions.setError(res, "Employee not found!");
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi tải lên hồ sơ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//danh sách, tìm kiếm lãnh đạo
exports.listInfoLeader = async (req, res, next) => {
    try {
        if (req.infoLogin) {
            let keyword = req.body.keyword
            let comId = req.infoLogin.comId
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listPositionId = [4, 20, 13, 12, 11, 10, 6, 5, 8, 7, 16, 14, 21, 22, 19, 18, 17]
            let infoLeader = await Users.find({
                userName: new RegExp(keyword, "i"),
                "inForPerson.employee.com_id": comId,
                "inForPerson.employee.position_id": { $in: listPositionId }
            }, {
                idQLC: 1,
                avatarUser: 1,
                userName: 1,
                "inForPerson.employee.position_id": 1,
                "inForPerson.employee.dep_id": 1,
                "inForPerson.employee.team_id": 1,
                "inForPerson.employee.group_id": 1,
            }).skip(skip).limit(limit)

            let infoLeaderAfter = []
            for (let i = 0; i < infoLeader.length; i++) {
                let info = {}
                info._id = infoLeader[i].idQLC
                info.userName = infoLeader[i].userName
                info.avatarUser = `${process.env.hostFile}${infoLeader[i].avatarUser}`
                info.namePosition = positionNames[infoLeader[i].inForPerson.employee.position_id];

                if (infoLeader[i].inForPerson.employee.dep_id) {
                    let infoDep = await Deparment.findOne({ _id: infoLeader[i].inForPerson.employee.dep_id, com_id: comId })
                    info.dep_name = infoDep.dep_name

                    if (infoLeader[i].inForPerson.employee.team_id) {
                        let infoTeam = await Team.findOne({
                            _id: infoLeader[i].inForPerson.employee.team_id,
                            com_id: comId,
                            dep_id: infoLeader[i].inForPerson.employee.dep_id,
                        })
                        info.team_name = infoTeam.teamName

                        if (infoLeader[i].inForPerson.employee.group_id) {
                            let infoGroup = await Group.findOne({
                                _id: infoLeader[i].inForPerson.employee.group_id,
                                com_id: comId,
                                dep_id: infoLeader[i].inForPerson.employee.dep_id,
                                team_id: infoLeader[i].inForPerson.employee.team_id
                            })
                            info.group_name = infoGroup.teamName
                        } else info.group_name = "chưa cập nhật"


                    } else {
                        info.team_name = "chưa cập nhật"
                        info.group_name = "chưa cập nhật"
                    }

                } else {
                    info.dep_name = "chưa cập nhật"
                    info.team_name = "chưa cập nhật"
                    info.group_name = "chưa cập nhật"
                }
                infoLeaderAfter.push(info)
            }

            if (infoLeader) {
                return functions.success(res, 'hiển thị danh sách lãnh đạo thành công', { infoLeaderAfter });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi tải lên hồ sơ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//chi tiết lãnh đạo
exports.leaderDetail = async (req, res, next) => {
    try {
        if (req.infoLogin && req.body.empId) {
            let empId = req.body.empId
            let description = req.body.description
            let result = {}
            let infoUser = await Users.findOne({ idQLC: empId, type: 2 })

            if (infoUser) {
                let infoUserHr = await HR_InfoLeaders.findOne({ epId: empId })
                if (infoUserHr) {
                    result.ep_name = infoUser.userName
                    result.namePosition = positionNames[infoUser.inForPerson.employee.position_id]
                    result.avatarUser = `${process.env.hostFile}${infoUser.avatarUser}`
                    result.description = infoUserHr.description

                    if (result) {
                        return functions.success(res, 'hiển thị danh sách lãnh đạo thành công', { result });
                    }
                } else {
                    const maxID = await HR_InfoLeaders.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                    if (maxID) {
                        newIDMax = Number(maxID.id) + 1;
                    } else newIDMax = 1
                    let desPosition = 0;
                    if (infoUser && infoUser.inForPerson && infoUser.inForPerson.employee && infoUser.inForPerson.employee.position_id) desPosition = infoUser.inForPerson.employee.position_id
                    let insertUser = new HR_InfoLeaders({
                        id: newIDMax,
                        epId: empId,
                        avatar: (infoUser.avatarUser ? infoUser.avatarUse : null),
                        description: description,
                        desPosition: desPosition,
                        created_at: new Date(Date.now())
                    })
                    insertUser.save()
                    if (insertUser) {
                        return functions.success(res, 'cập nhật chi tiết lãnh đạo thành công');
                    } else {
                        return functions.setError(res, 'update info leader fail!');
                    }
                }

            } else functions.setError(res, "không tìm thấy thông tin user", 400);

        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi tải lên hồ sơ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật chi tiết lãnh đạo
exports.updateLeaderDetail = async (req, res, next) => {
    try {
        if (req.infoLogin && req.body.empId) {
            let empId = req.body.empId
            let description = req.body.description
            if (!description) {
                return functions.setError(res, "Missing input description!");
            }

            let updateUserHr = await HR_InfoLeaders.findOneAndUpdate({ epId: empId }, { description: description, updated_at: new Date(Date.now()) }, { new: true })

            if (updateUserHr) {
                return functions.success(res, 'cập nhật chi tiết lãnh đạo thành công', { updateUserHr });
            }
            return functions.setError(res, "Lanh dao not found!", 405);
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi tải lên hồ sơ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Thêm mới nhân viên sử dụng con dấu
exports.updateEmpUseSignature = async (req, res, next) => {
    try {
        if (req.infoLogin && req.body.empId) {
            let comId = req.infoLogin.comId;
            let empId = req.body.empId
            let depId = req.body.depId
            let positionId = req.body.positionId

            let query = {
                idQLC: empId,
                type: 2,
                "inForPerson.employee.com_id": comId
            }
            if (depId) {
                query = {
                    idQLC: empId,
                    type: 2,
                    "inForPerson.employee.com_id": comId,
                    "inForPerson.employee.dep_id": depId
                }

            }
            if (positionId) {
                query = {
                    idQLC: empId,
                    type: 2,
                    "inForPerson.employee.com_id": comId,
                    "inForPerson.employee.dep_id": depId,
                    "inForPerson.employee.position_id": position_id
                }
            }

            if (depId && positionId) {
                query = {
                    idQLC: empId,
                    type: 2,
                    "inForPerson.employee.com_id": comId,
                    "inForPerson.employee.dep_id": depId,
                    "inForPerson.employee.position_id": position_id,
                    "inForPerson.employee.dep_id": depId
                }
            }
            let updateUserHr = await Users.findOneAndUpdate(query, {
                "inForPerson.employee.ep_signature": 1,
                updatedAt: new Date(Date.now())
            }, { new: true })

            if (updateUserHr) {
                return functions.success(res, 'cập nhật người sử dụng con dấu thành công');
            }
            return functions.setError(res, "Employee not found!", 405);
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Danh sách nhân viên sử dụng con dấu (có tìm kiếm)
exports.listEmpUseSignature = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        let {key, dep_id, page, pageSize} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 5;
        const skip = (page-1)*pageSize;
        let condition = {"inForPerson.employee.com_id": comId,"inForPerson.employee.ep_signature": 1};
        if(key) {
            if(!isNaN(parseFloat(key)) && isFinite(key)) condition.idQLC = Number(key);
            else condition.userName = new RegExp(key, 'i');
        }
        if(dep_id) condition["inForPerson.employee.dep_id"] = dep_id;
        let fields = {idQLC: 1, avatarUser: 1, userName: 1, "inForPerson.employee.position_id": 1, "inForPerson.employee.dep_id": 1};
        let total = Users.countDocuments(condition);
        let listEmployee = functions.pageFindWithFields(Users, condition, fields, {idQLC: -1}, skip, pageSize);
        total = await total;
        listEmployee = await listEmployee;
        return functions.success(res, "Get list employee signature success!", {total, listEmployee});
    } catch (e) {
        console.log("Err from server get list employee signature!", e);
        return functions.setError(res, e.message);
    }
}

//Xóa nhân viên sử dụng con dấu
exports.deleteEmpUseSignature = async (req, res, next) => {
    try {
        if (req.infoLogin && req.body.empId) {
            let comId = req.infoLogin.comId;
            let empId = req.body.empId;

            let updateUserHr = await Users.findOneAndUpdate({
                idQLC: empId,
                type: 2,
                "inForPerson.employee.com_id": comId
            }, {
                "inForPerson.employee.ep_signature": 0,
                updatedAt: new Date(Date.now())
            }, { new: true })

            if (updateUserHr) {
                return functions.success(res, 'xóa người sử dụng con dấu thành công');
            } else {
                return functions.setError(res, "Emplyee not found!", 505);
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//danh sách, tìm kiếm chữ ký lãnh đạo
exports.listSignatureLeader = async (req, res, next) => {
    try {
        if (req.infoLogin) {
            let keyword = req.body.keyword
            let comId = req.infoLogin.comId
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listPositionId = [4, 20, 13, 12, 11, 10, 6, 5, 8, 7, 16, 14, 21, 22, 19, 18, 17]
            let infoLeader
            if (isNaN(keyword) == true) {
                infoLeader = await Users.find({
                    userName: new RegExp(keyword, "i"),
                    "inForPerson.employee.com_id": comId,
                    "inForPerson.employee.position_id": { $in: listPositionId }
                }, {
                    idQLC: 1,
                    userName: 1,
                    "inForPerson.employee.position_id": 1,
                    "inForPerson.employee.dep_id": 1,
                }).skip(skip).limit(limit)
            } else if (isNaN(keyword) == false) {
                infoLeader = await Users.find({
                    idQLC: keyword,
                    "inForPerson.employee.com_id": comId,
                    "inForPerson.employee.position_id": { $in: listPositionId }
                }, {
                    idQLC: 1,
                    userName: 1,
                    "inForPerson.employee.position_id": 1,
                    "inForPerson.employee.dep_id": 1,
                }).skip(skip).limit(limit)
            }

            if (infoLeader) {
                let infoLeaderAfter = []
                for (let i = 0; i < infoLeader.length; i++) {
                    let info = {}
                    info._id = infoLeader[i].idQLC
                    info.userName = infoLeader[i].userName
                    info.namePosition = positionNames[infoLeader[i].inForPerson.employee.position_id];

                    if (infoLeader[i].inForPerson.employee.dep_id) {
                        let infoDep = await Deparment.findOne({ _id: infoLeader[i].inForPerson.employee.dep_id, com_id: comId })
                        info.dep_name = infoDep.dep_name
                    } else {
                        info.dep_name = "chưa cập nhật"
                    }

                    let infoSig = await HR_SignatureImages.findOne({ empId: infoLeader[i].idQLC }, { imgName: 1 })
                    if (infoSig) {
                        info.linkSignature = `${process.env.hostFile}storage/hr/upload/signature/${infoSig.imgName}`
                    } else info.linkSignature = "chưa cập nhật"

                    infoLeaderAfter.push(info)
                }
                return functions.success(res, 'hiển thị danh sách lãnh đạo thành công', { infoLeaderAfter });
            }
            return functions.setError(res, "không tìm thấy lãnh đạo nào", 400);
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi tải lên hồ sơ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// danh sách nhân viên chưa chấm công hoặc đã chấm công
exports.listEmUntimed = async (req, res, next) => {
    try {
        let {emp_id, com_id, dep_id, position_id, group_id, team_id, birthday, gender, married, page, pageSize} = req.body;
        if(!com_id) com_id = req.infoLogin.comId;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        const skip = (page-1)*pageSize;
        let fields = {idQLC: 1, userName: 1, phone: 1, phoneTK: 1, email: 1, address: 1,
            inForPerson: {
                account: {birthday: 1, gender: 1, married: 1, experience: 1, education: 1},
                employee: {com_id: 1, dep_id: 1,group_id: 1, team_id: 1,position_id: 1,start_working_time: 1}
            }
        };

        let condition = {type: 2, "inForPerson.employee.com_id": com_id};
        if(emp_id) condition.idQLC = emp_id;
        if(dep_id) condition["inForPerson.employee.dep_id"] = dep_id;
        if(group_id) condition["inForPerson.employee.group_id"] = group_id;
        if(team_id) condition["inForPerson.employee.team_id"] = team_id;
        if(position_id) condition["inForPerson.employee.position_id"] = position_id;

        if(gender) condition["inForPerson.account.gender"] = gender;
        if(married) condition["inForPerson.account.married"] = married;
        if(birthday) condition["inForPerson.account.birthday"] = new RegExp(birthday);

        let company = await Users.findOne({idQLC: com_id}, {userName: 1, idQLC: 1});
        let listEmployee = [];
        let total = 0;
        // chấm công hoặc chưa chấm công
        let type_timekeep = Number(req.body.type_timekeep);
        if (type_timekeep === 1 || type_timekeep===2) {
            let condition2;
            if(type_timekeep===1) condition2 = {Time_sheets: {$ne: []}};
            if(type_timekeep===2) condition2 = {Time_sheets: {$eq: []}};
            listEmployee = await Users.aggregate([
                {$match: condition},
                {
                    $lookup: {
                        from: "QLC_Time_sheets",
                        localField: "idQLC",
                        foreignField: "ep_id",
                        as: "Time_sheets"
                    }
                },
                {$match: condition2},
                {$project: {...fields, Time_sheets: 1}},
                {$sort: {idQLC: -1}},
                {$skip: skip},
                {$limit: pageSize},
            ]);
        }else {
            listEmployee = await functions.pageFindWithFields(Users, condition, fields, {idQLC: -1}, skip, pageSize);
        }
        total = listEmployee.length;
        return functions.success(res, 'get data success', {total, company ,listEmployee})
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message, 500);
    }
};