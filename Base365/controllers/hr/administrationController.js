const Users = require('../../models/Users');
const ProvisionOfCompanys = require('../../models/hr/ProvisionOfCompanys');
const functions = require('../../services/functions');
const HR = require('../../services/hr/hrService');
const Policys = require('../../models/hr/Policys');
const EmployeePolicys = require('../../models/hr/EmployeePolicys');
const PerUser = require('../../models/hr/PerUsers');
const EmployeePolicySpecifics = require('../../models/hr/EmployeePolicySpecifics');

// thêm nhóm quy định
exports.addProvision = async (req, res, next) => {
    try {
        let name = req.body.name;
        let description = req.body.description;
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let comId = req.infoLogin.comId;
        let createdAt = new Date();
        let File = req.files;
        let link = '';

        if (name && description && timeStart && supervisorName) {
           
            if (File.policy) {
                let checkUpload = await HR.HR_UploadFile('policy', comId, File.policy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload failed', 404)
                }
                link = checkUpload
            } else {
                link = null;
            }
            let id = await HR.getMaxId(ProvisionOfCompanys)
            await ProvisionOfCompanys.create({ id, name, description, timeStart, supervisorName, comId, createdAt, isDelete: 0, file: link })
        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, 'add provision success')
    } catch (error) {

        return functions.setError(res, error)
    }
}

// thêm quy định
exports.addPolicy = async (req, res, next) => {
    try {
        let name = req.body.name;
        let provisionId = Number(req.body.provision_id);
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let applyFor = req.body.apply_for;
        let content = req.body.content;
        let createdBy = req.infoLogin.name;
        let comId = Number(req.infoLogin.comId);
        let createdAt = new Date();
        let File = req.files;
        let link = '';

        if (name && provisionId && timeStart && supervisorName && applyFor && content) {
           
            if (await functions.checkNumber(provisionId) === false) {
                return functions.setError(res, 'invalid number', 404)
            }
            if (File.policy) {
                let checkUpload = await HR.HR_UploadFile('policy', comId, File.policy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload failed', 404)
                }
                link = checkUpload
            } else {
                link = null;
            }
            let checkProvisionId = await ProvisionOfCompanys.findOne({ id: provisionId, isDelete: 0 })
            if (!checkProvisionId) {
                return functions.setError(res, 'not found data provision', 404)
            }
            let id = await HR.getMaxId(Policys)
            await Policys.create({ id, name, provisionId, timeStart, supervisorName, createdBy, comId, applyFor, content, createdAt, file: link })
        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, 'add policy success')
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// chỉnh sửa quy định
exports.updatePolicy = async (req, res, next) => {
    try {
        let infoLogin = req.infoLogin;
        let id = Number (req.body.id);
        let name = req.body.name;
        let provisionId = Number(req.body.provision_id);
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let applyFor = req.body.apply_for;
        let content = req.body.content;
        let createdBy = 'công ty';
        if (infoLogin.type != 1) {
            createdBy = infoLogin.name;
        }
        let comId = infoLogin.comId;
        let File = req.files;
        let fileName = null;

        if (id && name && provisionId && timeStart && supervisorName && applyFor && content) {
           
            if (await functions.checkNumber(provisionId) === false) {
                return functions.setError(res, 'invalid number', 404)
            }
            let check = await Policys.findOne({id: id,isDelete:0});
            if (!check) {
                return functions.setError(res, 'not found policy', 404)
            }
            if (File) {
                let checkUpload = await HR.HR_UploadFile('policy', comId, File.policy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload failed', 404)
                }
                link = checkUpload
                await Policys.findOneAndUpdate({ id: id},{ file: link})
            }
             await Policys.findOneAndUpdate({ id: id }, { name, provisionId, timeStart, supervisorName, createdBy, comId, applyFor, content });
            return functions.success(res, 'update policy success')
        } else {
            return functions.setError(res, 'missing data', 404)
        }

    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// danh sách nhóm quy định 
exports.listProvision = async (req, res, next) => {
    try {
        let page = req.query.page;
        let pageSize = req.query.pageSize;
        let keyWords = req.query.keyWords || null;
        let comId = req.infoLogin.comId;
        if (!page || !pageSize) {
            return functions.setError(res, 'missing data', 400)
        }
        if (await functions.checkNumber(page) === false || await functions.checkNumber(pageSize) === false) {
            return functions.setError(res, 'invalid Number', 400)
        }
        let skip = (page - 1) * pageSize;
        let data = [];
        let totalProvisionOfCompanys = 0;
        if (!keyWords) {
            data = await ProvisionOfCompanys.find({ comId, isDelete: 0 }).skip(skip).limit(pageSize);
            totalProvisionOfCompanys = await ProvisionOfCompanys.find({ comId, isDelete: 0 }).count();
        } else {
            data = await ProvisionOfCompanys.find({ name: { $regex: `.*${keyWords}.*` }, comId, isDelete: 0 }).skip(skip).limit(pageSize);
            totalProvisionOfCompanys = await ProvisionOfCompanys.find({ name: { $regex: `.*${keyWords}.*` }, comId, isDelete: 0 }).count();
        }
             data = await HR.getLinkFile(data,'policy',comId)
        let tongSoTrang = Math.ceil(totalProvisionOfCompanys / pageSize)
        return functions.success(res, 'get data success', {tongSoTrang,tongSoBanGhi: totalProvisionOfCompanys,data})
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// chi tiết nhóm quy định
exports.detailProvision = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        let id = req.query.id;
        let data = await ProvisionOfCompanys.find({ id, comId,isDelete:0 })
        data = await HR.getLinkFile(data,'policy',comId)
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)

    }
}

// sửa nhóm quy định
exports.updateProvision = async (req, res, next) => {
    try {
        let name = req.body.name;
        let description = req.body.description;
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let comId = req.infoLogin.comId;
        let createdAt = new Date();
        let File = req.files;
        let link = '';
        let id = Number (req.body.id);
        if (id && name && description && timeStart && supervisorName) {
           
            let check = await ProvisionOfCompanys.findOne({ id, comId ,isDelete:0});
            if (!check) return functions.setError(res, 'data not found', 404)
            if (File.policy) {
                let checkUpload = await HR.HR_UploadFile('policy', comId, File.policy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                link = checkUpload
                await ProvisionOfCompanys.findOneAndUpdate({ id }, { name, description, timeStart, supervisorName, comId, file: link })
            } else {
                await ProvisionOfCompanys.findOneAndUpdate({ id }, { name, description, timeStart, supervisorName, comId })
            }

        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, 'update provision success')
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// xoá nhóm quy định
exports.deleteProvision = async (req, res, next) => {
    try {
        let id = Number (req.body.id);
        let comId = req.infoLogin.comId;
        let check = await ProvisionOfCompanys.findOne({ id, comId ,isDelete:0});
        if (!check) {
            return functions.setError(res, 'not found provision', 404)
        }
        await ProvisionOfCompanys.findOneAndUpdate({ id, comId }, { isDelete: 1, deletedAt: new Date() })
        return functions.success(res, 'delete provision success')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// danh sách quy định theo nhóm quy định
exports.listPolicy = async (req, res, next) => {
    try {
        let id = Number (req.query.id);
        let comId = req.infoLogin.comId;
        let data = await Policys.find({ provisionId: id, isDelete: 0 })
        data = await HR.getLinkFile(data,'policy',comId)
        return functions.success(res, 'get data provision success', { data })
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// chi tiết quy định
exports.detailPolicy = async (req, res, next) => {
    try {
        let id = Number(req.query.id);
        let comId = req.infoLogin.comId;
        let searchItem = {
            id: 1, provisionId: 1, timeStart: 1, supervisorName: 1, applyFor: 1
            , content: 1, createdBy: 1, createdAt: 1, name: 1, file: 1, 
            tenNhomQuyDinh :'$ProvisionOfCompanys.name'
        }
        let data = await Policys.aggregate([
            {
                $match: { id,isDelete:0 }
            }, 
            {
                $lookup: {
                    from: "HR_ProvisionOfCompanys",
                    localField: 'provisionId',
                    foreignField: 'id',
                    as: "ProvisionOfCompanys"
                }
            },{
                $project: searchItem
            }
        ])
        data = await HR.getLinkFile(data,'policy',comId)
        return functions.success(res, 'get data provision success', { data })
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// Xoá quy định
exports.deletePolicy = async (req, res, next) => {
    try {
        let id = Number(req.body.id);
        let check = await Policys.findOne({ id ,isDelete:0});
        if (!check) {
            return functions.setError(res, 'not found provision', 404)
        }
        await Policys.findOneAndUpdate({ id }, { isDelete: 1, deletedAt: new Date() })
        return functions.success(res, 'delete provision success')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// Thêm mới nhóm chính sách
exports.addEmployeePolicy = async (req, res, next) => {
    try {
        let name = req.body.name;
        let description = req.body.description;
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let comId = req.infoLogin.comId;
        let File = req.files;
        let link = '';
        let createdAt = new Date();
        if (name && description && timeStart && supervisorName) {
           
            if (File.policy) {
                let checkUpload = await HR.HR_UploadFile('policy', comId, File.policy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                link = checkUpload
            } else {
                link = null;
            }
            let id = await HR.getMaxId(EmployeePolicys)
            await EmployeePolicys.create({ id, name, description, timeStart, supervisorName, comId, createdAt, file: link })
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'add success')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// Sửa nhóm chính sách
exports.updateEmployeePolicy = async (req, res, next) => {
    try {
        let name = req.body.name;
        let description = req.body.description;
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let id = Number(req.body.id);
        let comId = req.infoLogin.comId;
        let createdAt = new Date();
        let File = req.files;
        if (name && description && timeStart && supervisorName && id) {
           
            let check = await  EmployeePolicys.findOne({id,isDelete:0});
            if(!check) return functions.setError(res, 'not found employee policy',404)
            if (File.policy) {
                let checkUpload = await HR.HR_UploadFile('policy', comId, File.policy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                link = checkUpload
                await EmployeePolicys.findOneAndUpdate({ id }, { name, description, timeStart, supervisorName, comId, createdAt, file: link })
            } else {
                await EmployeePolicys.findOneAndUpdate({ id }, { name, description, timeStart, supervisorName, comId, createdAt })
            }

        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'update data success')
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// xoá nhóm chính sách
exports.deleteEmployeePolicy = async (req, res, next) => {
    try {
        let id = Number (req.body.id);
        let comId = req.infoLogin.comId;
        let check = await EmployeePolicys.findOne({ id, comId,isDelete:0 });
        if (!check) {
            return functions.setError(res, 'not found provision', 404)
        }
        await EmployeePolicys.findOneAndUpdate({ id, comId }, { isDelete: 1, deletedAt: new Date() })
        return functions.success(res, 'delete provision success')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// Thêm mới chính sách
exports.addEmpoyePolicySpecific = async (req, res, next) => {
    try {
        // await HR.checkPermissions(req, res, next,'read',2);
       
        let name = req.body.name;
        let employeePolicyId = req.body.employe_policy_id;
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let applyFor = req.body.apply_for;
        let content = req.body.content;
        let createdBy = req.infoLogin.name;
        let comId = req.infoLogin.comId;
        let File = req.files;
        let link = '';
        let createdAt = new Date();

        if (name && employeePolicyId && timeStart && supervisorName && applyFor && content) {
            
            if (File.policy) {
                 checkUpload = await HR.HR_UploadFile('policy', comId, File.policy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                link = checkUpload
            } else {
                link = null;
            }
            let id = await HR.getMaxId(EmployeePolicySpecifics)
            await EmployeePolicySpecifics.create({ id, name, employeePolicyId, timeStart, supervisorName, comId, applyFor, content, createdAt, createdBy, file: link })
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'add success')
    } catch (error) {
        return functions.setError(res, error)
    }
}
// danh sách nhóm chính sách
exports.listEmpoyePolicy = async (req, res, next) => {
    try {
        let page = req.query.page;
        let pageSize = req.query.pageSize;
        let keyWords = req.query.keyWords || null;
        let comId = req.infoLogin.comId;
        if (!page || !pageSize) {
            return functions.setError(res, 'missing data', 400)
        }
        if (await functions.checkNumber(page) === false || await functions.checkNumber(pageSize) === false) {
            return functions.setError(res, 'invalid Number', 400)
        }
        let skip = (page - 1) * pageSize;
        let data = [];
        let totalEmpoyePolicy = 0;
        if (!keyWords) {
            data = await EmployeePolicys.find({ comId, isDelete: 0 }).skip(skip).limit(pageSize);
            totalEmpoyePolicy = await EmployeePolicys.find({ comId, isDelete: 0 }).count();
        } else {
            data = await EmployeePolicys.find({ name: { $regex: `.*${keyWords}.*` }, comId, isDelete: 0 }).skip(skip).limit(pageSize);
            totalEmpoyePolicy = await EmployeePolicys.find({ name: { $regex: `.*${keyWords}.*` }, comId, isDelete: 0 }).count();
        }
        let tongSoTrang = Math.ceil(totalEmpoyePolicy / pageSize)
        data = await HR.getLinkFile(data,'policy',comId)
        return functions.success(res, 'get data success', {tongSoTrang: tongSoTrang, tongSoBanGhi: totalEmpoyePolicy, data })
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// chi tiết nhóm chính sách
exports.getDetailPolicy = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        let id = req.query.id;
        let data = await EmployeePolicys.find({ id, comId,isDelete:0 })
        data = await HR.getLinkFile(data,'policy',comId)
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// danh sách chính sách theo nhóm chính sách
exports.listEmployeePolicySpecific = async (req, res, next) => {
    try {
        let id = req.query.id;
        let comId = req.infoLogin.comId;
        let data = await EmployeePolicySpecifics.find({ employeePolicyId: id,isDelete:0 })
        data = await HR.getLinkFile(data,'policy',comId)
        return functions.success(res, 'get data  success', { data })
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// chi tiết chính sách
exports.detailEmployeePolicySpecific = async (req, res, next) => {
    try {
        let id = Number(req.query.id);
        let comId = req.infoLogin.comId;
        let data = await EmployeePolicySpecifics.aggregate([
            {
                $lookup: {
                    from: 'HR_EmployeePolicys',
                    localField: 'employeePolicyId',
                    foreignField: 'id',
                    as: "EmployeePolicys"
                }
            }, {
                $match: { id,isDelete:0 }
            }, {
                $project: {
                    id: 1, name: 1, employeePolicyId: 1, timeStart: 1, supervisorName: 1, description: 1, content: 1, applyFor: 1,
                    createdBy: 1, isDelete: 1, file: 1, createdAt: 1, deletedAt: 1, EmployeePolicys: { name: 1 }
                }
            }
        ])
        data = await HR.getLinkFile(data,'policy',comId)
        return functions.success(res, 'get data  success', { data })
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// Xoá chính sách
exports.deleteEmployeePolicySpecific = async (req, res, next) => {
    try {
        let id = Number (req.body.id);
        let check = await EmployeePolicySpecifics.findOne({ id });
        if (!check) {
            return functions.setError(res, 'not found provision', 404)
        }
        await EmployeePolicySpecifics.findOneAndUpdate({ id }, { isDelete: 1, deletedAt: new Date() })
        return functions.success(res, 'delete provision success')
    } catch (error) {
        return functions.setError(res, error)
    }
}


// Sửa chính sách
exports.updateEmployeePolicySpecific = async (req, res, next) => {
    try {
        // await HR.checkPermissions(req, res, next,'read',2);
        let name = req.body.name;
        let employeePolicyId = Number(req.body.employe_policy_id);
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let applyFor = req.body.apply_for;
        let content = req.body.content;
        let createdBy = req.infoLogin.name;
        let comId = req.infoLogin.comId;
        let id = Number(req.body.id);
        let File = req.files;
        let link = '';
        let updateAt = new Date();

        if (name && employeePolicyId && timeStart && supervisorName && applyFor && content && id) {
            let check = await EmployeePolicySpecifics.findOne({ id ,isDelete:0})
            if (!check) return functions.setError(res, 'not found', 404);
           
            if (File.policy) {
                let checkUpload = await HR.HR_UploadFile('policy', comId, File.policy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                link = checkUpload
                await EmployeePolicySpecifics.findOneAndUpdate({ id }, {
                    name, employeePolicyId, timeStart, supervisorName, comId,
                    applyFor, content, updateAt, createdBy, file: link
                })
            } else {
                await EmployeePolicySpecifics.findOneAndUpdate({ id }, {
                    name, employeePolicyId, timeStart, supervisorName, comId,
                    applyFor, content, updateAt, createdBy
                })
                
            }
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'add success')
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}