const Users = require('../../models/Users');
const ProvisionOfCompanys = require('../../models/hr/ProvisionOfCompanys');
const functions = require('../../services/functions');
const HR = require('../../services/hr/hrService');
const Policys = require('../../models/hr/Policys');
const EmployeePolicys = require('../../models/hr/EmployeePolicys');
const PerUser  = require('../../models/hr/PerUsers');
// thêm nhóm quy định
exports.addProvision = async (req, res, next) => {
    try {
        let name = req.body.name;
        let description = req.body.description;
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let comId = req.comId;
        let createdAt = new Date();
        let File = req.files;
        let link = '';

        if (name && description && timeStart && supervisorName) {
            if (await functions.checkDate(timeStart) === false || await functions.checkTime(timeStart) === false) {
                return functions.setError(res, 'invalid date', 404)
            }
            if (File.provision) {
                let checkUpload = await HR.HR_UploadFile('provision', comId, File.provision, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                link = HR.createLinkFileHR('provision', comId, File.provision.name)
            } else {
                link = null;
            }

            await ProvisionOfCompanys.create({ id: 1, name, description, timeStart, supervisorName, comId, createdAt, file: link })
        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, 'add provision success')
    } catch (error) {
        console.log("🚀 ~ file: administrationController.js:32 ~ exports.addProvision= ~ error:", error)
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
        let createdBy = 'công ty';
        let comId = req.comId;
        let createdAt = new Date();
        let File = req.files;
        let link = '';

        if (name && provisionId && timeStart && supervisorName && applyFor && content) {
            if (await functions.checkDate(timeStart) === false || await functions.checkTime(timeStart) === false) {
                return functions.setError(res, 'invalid date', 404)
            }
            if (await functions.checkNumber(provisionId) === false) {
                return functions.setError(res, 'invalid number', 404)
            }
            if (File.policy) {
                let checkUpload = await HR.HR_UploadFile('policy', comId, File.policy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                link = HR.createLinkFileHR('policy', comId, File.policy.name)
            } else {
                link = null;
            }
            let checkProvisionId = await ProvisionOfCompanys.find({ id: provisionId })
            if (!checkProvisionId || checkProvisionId.length === 0) {
                return functions.setError(res, 'not found data provision', 404)
            }
            await Policys.create({ id: 1000, name, provisionId, timeStart, supervisorName, createdBy, comId, applyFor, content, createdAt, file: link })
        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, 'add provision success')
    } catch (error) {
        console.log("🚀 ~ file: administrationController.js:32 ~ exports.addProvision= ~ error:", error)
        return functions.setError(res, error)
    }
}

// danh sách nhóm quy định 
exports.listProvision = async (req, res, next) => {
    try {
        let page = req.query.page;
        let pageSize = req.query.pageSize;
        let keyWords = req.query.keyWords || null;
        let comId = req.comId;
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
        let tongSoTrang = Math.ceil(totalProvisionOfCompanys / pageSize)
        data.push({ tongSoTrang: tongSoTrang, tongSoBanGhi: totalProvisionOfCompanys })
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: walfareController.js:168 ~ exports.listAchievement= ~ error:", error)
        return functions.setError(res, error)
    }
}

// chi tiết nhóm quy định
exports.detailProvision = async (req, res, next) => {
    try {
        let comId = req.comId;
        let id = req.query.id;
        let data = await ProvisionOfCompanys.find({ id, comId })
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: administrationController.js:130 ~ exports.detailProvision= ~ error:", error)
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
        let comId = req.comId;
        let createdAt = new Date();
        let File = req.files;
        let link = '';
        let id = req.body.id;
        if (id && name && description && timeStart && supervisorName) {
            if (await functions.checkDate(timeStart) === false || await functions.checkTime(timeStart) === false) {
                return functions.setError(res, 'invalid date', 404)
            }
            if (File.provision) {
                let checkUpload = await HR.HR_UploadFile('provision', comId, File.provision, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                let checkFile = await ProvisionOfCompanys.findOne({ id, comId });
                if (checkFile.file) {
                    await HR.deleteFileHR('provision', comId, checkFile.file.split('/').reverse()[0])
                }
                link = HR.createLinkFileHR('provision', comId, File.provision.name)
                await ProvisionOfCompanys.findOneAndUpdate({ id, comId }, { name, description, timeStart, supervisorName, comId, createdAt, file: link })
            } else {
                await ProvisionOfCompanys.findOneAndUpdate({ id, comId }, { name, description, timeStart, supervisorName, comId, createdAt })
            }

        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, 'add provision success')
    } catch (error) {
        console.log("🚀 ~ file: administrationController.js:32 ~ exports.addProvision= ~ error:", error)
        return functions.setError(res, error)
    }
}

// xoá nhóm quy định
exports.deleteProvision = async (req, res, next) => {
    try {
        let id = req.body.id;
        let comId = req.comId;
        let check = await ProvisionOfCompanys.findOne({ id, comId });
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
        let id = req.query.id;
        let data = await Policys.find({ provisionId: id, isDelete: 0 })
        return functions.success(res, 'get data provision success', { data })
    } catch (error) {
        return functions.setError(res, error)
    }
}

// chi tiết quy định
exports.detailPolicy = async (req, res, next) => {
    try {
        let id = req.query.id || 1000;
        let searchItem = {
            id: 1, provisionId: 1, timeStart: 1, supervisorName: 1, applyFor: 1
            , content: 1, createdBy: 1, createdAt: 1, name: 1, file: 1, ProvisionOfCompanys: { name: 1 }
        }
        let data = await Policys.aggregate([
            {
                $lookup: {
                    from: "HR_ProvisionOfCompanys",
                    localField: 'provisionId',
                    foreignField: 'id',
                    as: "ProvisionOfCompanys"
                }
            },
            {
                $project: searchItem
            }, {
                $match: { id }
            }

        ])
        return functions.success(res, 'get data provision success', { data })
    } catch (error) {
        return functions.setError(res, error)
    }
}

// Xoá quy định
exports.deletePolicy = async (req, res, next) => {
    try {
        let id = req.body.id;
        let check = await Policys.findOne({ id });
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
        let comId = req.comId;
        let File = req.files;
        let link = '';
        let createdAt = new Date();
        if (name && description && timeStart && supervisorName) {
            if (await !functions.checkDate(timeStart) || await !functions.checkTime(timeStart)) {
                return functions.setError(res,'invalid date')
            }
            if (File.employeePolicy) {
                let checkUpload = await HR.HR_UploadFile('employeePolicy', comId, File.employeePolicy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                link = HR.createLinkFileHR('employeePolicy', comId, File.employeePolicy.name)
            } else {
                link = null;
            }
            await EmployeePolicys.create({id:1002,name,description,timeStart,supervisorName,comId,createdAt,file:link})
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
        let id = req.body.id;
        let comId = req.comId;
        let createdAt = new Date();
        let File  = req.files;
        if (name && description && timeStart && supervisorName && id) {
            if (await !functions.checkDate(timeStart) || await !functions.checkTime(timeStart)) {
                return functions.setError(res,'invalid date')
            }
            if (File.employeePolicy) {
                let checkUpload = await HR.HR_UploadFile('employeePolicy', comId, File.employeePolicy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                let checkFile = await EmployeePolicys.findOne({ id, comId });
                if (checkFile.file) {
                    await HR.deleteFileHR('employeePolicy', comId, checkFile.file.split('/').reverse()[0])
                }
                link = HR.createLinkFileHR('employeePolicy', comId, File.employeePolicy.name)
                await EmployeePolicys.findOneAndUpdate({id},{name,description,timeStart,supervisorName,comId,createdAt,file:link})
            } else {
                await EmployeePolicys.findOneAndUpdate({id},{name,description,timeStart,supervisorName,comId,createdAt})
            }
            
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'add success')
    } catch (error) {
        console.log("🚀 ~ file: administrationController.js:318 ~ exports.updateEmployeePolicy= ~ error:", error)
        return functions.setError(res, error)
    }
}

// xoá nhóm chính sách
exports.deleteEmployeePolicy = async (req, res, next) => {
    try {
        let id = req.body.id;
        let comId = req.comId;
        let check = await EmployeePolicys.findOne({ id, comId });
        if (!check) {
            return functions.setError(res, 'not found provision', 404)
        }
        await EmployeePolicys.findOneAndUpdate({ id, comId }, { isDelete: 1, deletedAt: new Date() })
        return functions.success(res, 'delete provision success')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// Thêm mới nhóm chính sách
exports.addEmpoyePolicySpecific = async (req, res, next) => {
    try {
        await HR.checkPermissions(req, res, next,'read','QLTTNS');
        
        let name = req.body.name;
        let employePolicyId = req.body.employe_policy_id;
        let timeStart = req.body.time_start;
        let supervisorName = req.body.supervisor_name;
        let applyFor = req.body.apply_for;
        let content = req.body.content;
        let createdBy = ' công ty'
        let comId = req.comId;
        let File = req.files;
        let link = '';
        let createdAt = new Date();
        if (name && description && timeStart && supervisorName) {
            if (await !functions.checkDate(timeStart) || await !functions.checkTime(timeStart)) {
                return functions.setError(res,'invalid date')
            }
            if (File.employeePolicy) {
                let checkUpload = await HR.HR_UploadFile('employeePolicy', comId, File.employeePolicy, ['.gif', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.ods', '.odt', '.odp', '.pdf', '.rtf', '.sxc', '.sxi', '.txt'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload faild', 404)
                }
                link = HR.createLinkFileHR('employeePolicy', comId, File.employeePolicy.name)
            } else {
                link = null;
            }
            await EmployeePolicys.create({id:1002,name,description,timeStart,supervisorName,comId,createdAt,file:link})
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'add success')
    } catch (error) {
        console.log("🚀 ~ file: administrationController.js:376 ~ exports.addEmpoyePolicySpecific= ~ error:", error)
        return functions.setError(res, error)
    }
}