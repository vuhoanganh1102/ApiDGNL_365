const Users = require('../../models/Users');
const AchievementFors = require('../../models/hr/AchievementFors');
const DepartmentDetails = require('../../models/hr/DepartmentDetails');
const InfringesFors = require('../../models/hr/InfringesFors');
const functions = require('../../services/functions');

// thêm khen thưởng cá nhân
exports.addAchievement = async (req, res, next) => {
    try {
        let comId = Number(req.comId);
        let achievementId = req.body.achievement_id;
        let content = req.body.content;
        let listUser = [];
        if (req.body.list_user && req.body.list_user_name) {
            for (let j = 0; j < req.body.list_user.split(',').length; j++) {
                let check_user = await Users.find({ idQLC: req.body.list_user.split(',')[j] })
                if (check_user && check_user.length) {
                    listUser.push({ userId: req.body.list_user.split(',')[j], name: req.body.list_user_name.split(',')[j] });
                } else {
                    return functions.setError(res, 'not found user', 400)
                }
            }
            if (req.body.list_user.split(',').length > 1) {
                type = 2;
            }
        }
        let type = 1;

        let createdBy = req.body.created_by;
        let achievementAt = req.body.achievement_at;
        if (await functions.checkDate(achievementAt) === false || await functions.checkTime(achievementAt) === false) {
            return functions.setError(res, 'invalid achievementAt', 400)

        }
        let achievementType = req.body.achievement_type;
        let appellation = req.body.appellation;
        let achievementLevel = req.body.achievement_level;
        let createdAt = new Date();
        if (achievementId && content && createdBy && achievementAt && achievementType && appellation && achievementLevel) {
            await AchievementFors.create({
                comId, achievementId, content, createdBy, achievementType, appellation, achievementLevel
                , createdAt, type, listUser
            })
        } else {
            return functions.setError(res, 'missing data', 400)
        }

        return functions.success(res, 'success')
    } catch (error) {
        console.log("🚀 ~ file: walfareController.js:42 ~ exports.addAchievement= ~ error:", error)
        return functions.setError(res, error)
    }
}

// thêm khen thưởng tập thể
exports.addAchievementGroup = async (req, res, next) => {
    try {
        let comId = Number(req.comId);
        let achievementId = req.body.achievement_id;
        let content = req.body.content;
        let type = 2;
        let createdBy = req.body.created_by;
        let achievementAt = req.body.achievement_at;
        let depId = req.body.dep_id;
        let depName = req.body.dep_name;
        let checkDep = await DepartmentDetails.find({ depId, comId });
        if (!checkDep || checkDep.length === 0) {
            return functions.setError(res, 'Không tìm thấy phòng ban', 404)
        }
        if (await functions.checkDate(achievementAt) === false || await functions.checkTime(achievementAt) === false) {
            return functions.setError(res, 'invalid achievementAt', 400)
        }
        let achievementType = req.body.achievement_type;
        let appellation = req.body.appellation;
        let achievementLevel = req.body.achievement_level;
        let createdAt = new Date();
        console.log(content)
        if (achievementId && content && depId && createdBy && achievementAt && achievementType && appellation && achievementLevel) {
            await AchievementFors.create({
                id: 1001, comId, achievementId, content, createdBy,
                achievementType, appellation, achievementLevel
                , createdAt, type, depId, depName
            })
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'success')
    } catch (error) {
        console.log("🚀 ~ file: walfareController.js:57 ~ exports.addAchievementGroup= ~ error:", error)
        return functions.setError(res, error, 400)
    }
}

// Sửa khen thưởng cá nhân
exports.updateAchievement = async (req, res, next) => {
    try {
        let comId = Number(req.comId);
        let achievementId = req.body.achievement_id;
        let content = req.body.content;
        let listUser = [];
        let id = Number(req.body.id);
        let check = await AchievementFors.find({ id,comId  });
        let listUpdate = [];
        if (!check || check.length === 0) {
            return functions.setError(res, 'không tìm thấy data', 404)
        }


        if (req.body.list_user) {
            for (let j = 0; j < req.body.list_user.split(',').length; j++) {
                let check_user = await Users.find({ idQLC: req.body.list_user.split(',')[j] })
                if (check_user && check_user.length) {
                    listUser.push({ userId: req.body.list_user.split(',')[j], name: req.body.list_user_name.split(',')[j] });
                } else {
                    return functions.setError(res, 'not found user', 400)
                }
            }
        }
        let createdBy = req.body.created_by;
        let achievementAt = req.body.achievement_at;
        if (await functions.checkDate(achievementAt) === false || await functions.checkTime(achievementAt) === false) {
            return functions.setError(res, 'invalid achievementAt', 400)

        }
        let achievementType = req.body.achievement_type;
        let appellation = req.body.appellation;
        let achievementLevel = req.body.achievement_level;
        let updatedAt = new Date();
        let depId = req.body.depId;
        let depName = req.body.depName;
        if (check[0].depId === 0) {
            listUpdate = {
                comId, achievementId, content, createdBy, achievementType, appellation, achievementLevel
                , updatedAt, listUser
            }
        } else {
            listUpdate = {
                comId, achievementId, content, createdBy, achievementType, appellation, achievementLevel
                , updatedAt, depId, depName
            }
        }
        if (achievementId && content && createdBy && achievementAt && achievementType && appellation && achievementLevel) {
            await AchievementFors.findOneAndUpdate({ id: id }, listUpdate)
        } else {
            return functions.setError(res, 'missing data', 400)
        }

        return functions.success(res, 'success')
    } catch (error) {
        console.log("🚀 ~ file: walfareController.js:42 ~ exports.addAchievement= ~ error:", error)
        return functions.setError(res, error)
    }
}

// danh sách khen thưởng
exports.listAchievement = async (req, res, next) => {
    try {
        let page = req.query.page;
        let pageSize = req.query.pageSize;
        let keyWords = req.query.keyWords || null;
        let type = Number(req.query.type);
        let comId = req.comId;
        if (!page || !pageSize || !type) {
            return functions.setError(res, 'missing data')
        }
        if (await functions.checkNumber(page) === false || await functions.checkNumber(pageSize) === false || await functions.checkNumber(type) === false) {
            return functions.setError(res, 'invalid Number', 400)
        }
        let skip = (page - 1) * pageSize;
        let data = [];
        let totalAchievementFors = 0;
        if (keyWords && type === 1) {
            data = await AchievementFors.find({ "listUser.name": { $regex: `.*${keyWords}.*` }, type: 1, comId }).skip(skip).limit(pageSize);
            totalAchievementFors = await AchievementFors.find({ "listUser.name": { $regex: `.*${keyWords}.*` }, type: 1, comId }).count();
            if (!data || data.length === 0) {
                data = await AchievementFors.find({ content: { $regex: `.*${keyWords}.*` }, type: 1 , comId}).skip(skip).limit(pageSize);
                totalAchievementFors = await AchievementFors.find({ content: { $regex: `.*${keyWords}.*` }, type: 1, comId }).count();
            }
        }
        else if (keyWords && type === 2) {
            data = await AchievementFors.find({ "listUser.name": { $regex: `.*${keyWords}.*` }, type: 2, comId }).skip(skip).limit(pageSize);
            totalAchievementFors = await AchievementFors.find({ "listUser.name": { $regex: `.*${keyWords}.*` }, type: 2, comId }).count();
            if (!data || data.length === 0) {
                data = await AchievementFors.find({ content: { $regex: `.*${keyWords}.*` }, comId , type: 2}).skip(skip).limit(pageSize);
                totalAchievementFors = await AchievementFors.find({ content: { $regex: `.*${keyWords}.*` }, type: 2, comId }).count();
            }
        }
        else if (!keyWords && type === 1) {
            data = await AchievementFors.find({ type: 1, comId }).skip(skip).limit(pageSize);
            totalAchievementFors = await AchievementFors.find({ type: 1, comId }).count();
        } else if (!keyWords && type === 2) {
            data = await AchievementFors.find({ type: 2, comId }).skip(skip).limit(pageSize);
            totalAchievementFors = await AchievementFors.find({ type: 2, comId }).count();
        } else {
            return functions.setError(res, 'invalid type', 404)
        }
        let tongSoTrang = Math.ceil(totalAchievementFors / pageSize)
        data.push({ tongSoTrang: tongSoTrang, tongSoBanGhi: totalAchievementFors })
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: walfareController.js:168 ~ exports.listAchievement= ~ error:", error)
        return functions.setError(res, error)
    }
}

// thêm mới kỉ luật cá nhân
exports.addInfinges = async (req, res, next) => {
    try {
        let comId = req.comId;
        let regulatoryBasis = req.body.regulatory_basis;
        let infringeName = req.body.infringe_name;
        let listUser = [];
        let createdBy = req.body.created_by;
        let infringeAt = req.body.infringe_at;
        if (await functions.checkDate(infringeAt) === false || await functions.checkTime(infringeAt) === false) {
            return functions.setError(res, 'invalid infringeAt', 400)

        }
        let infringeType = req.body.infringe_type;
        let numberViolation = req.body.number_violation;
        let createdAt = new Date();
        let type = 1;
        if (req.body.list_user && req.body.list_user_name) {
            for (let j = 0; j < req.body.list_user.split(',').length; j++) {
                let check_user = await Users.find({ idQLC: req.body.list_user.split(',')[j] })
                console.log("🚀 ~ file: walfareController.js:197 ~ exports.addInfinges= ~ check_user:", check_user)
                if (check_user && check_user.length) {
                    listUser.push({ userId: req.body.list_user.split(',')[j], name: req.body.list_user_name.split(',')[j] });
                } else {
                    return functions.setError(res, 'not found user', 400)
                }
            }
            if (req.body.list_user.split(',').length > 1) {
                type = 2;
            }
        }

        if (regulatoryBasis && infringeName && createdBy && infringeAt && infringeType && numberViolation) {
            await InfringesFors.create({
                id: 1000,
                comId, regulatoryBasis, infringeName, createdBy, infringeAt, infringeType, numberViolation
                , createdAt, type, listUser
            })
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'add data success')
    } catch (error) {
        console.log("🚀 ~ file: walfareController.js:168 ~ exports.listAchievement= ~ error:", error)
        return functions.setError(res, error)
    }
}

// thêm mới kỉ luật tập thể
exports.addInfingesGroup = async (req, res, next) => {
    try {
        let comId = req.comId;
        let regulatoryBasis = req.body.regulatory_basis;
        let infringeName = req.body.infringe_name;
        let createdBy = req.body.created_by;
        let infringeAt = req.body.infringe_at;
        if (await functions.checkDate(infringeAt) === false || await functions.checkTime(infringeAt) === false) {
            return functions.setError(res, 'invalid infringeAt', 400)

        }
        let infringeType = req.body.infringe_type;
        let numberViolation = req.body.number_violation;
        let createdAt = new Date();
        let type = 2;
        let depId = req.body.dep_id;
        let depName = req.body.dep_name;
        let checkDep = await DepartmentDetails.find({ depId, comId });
        // if (!checkDep || checkDep.length === 0) {
        //     return functions.setError(res, 'Không tìm thấy phòng ban', 404)
        // }


        if (regulatoryBasis && infringeName && createdBy && infringeAt && infringeType && numberViolation) {
            await InfringesFors.create({
                id: 1002,
                comId, regulatoryBasis, infringeName, createdBy, infringeAt, infringeType, numberViolation
                , createdAt, type, depName, depId
            })
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'add data success')
    } catch (error) {
        console.log("🚀 ~ file: walfareController.js:168 ~ exports.listAchievement= ~ error:", error)
        return functions.setError(res, error)
    }
}

// sửa kỉ luật
exports.updateInfinges = async (req, res, next) => {
    try {
        let comId = Number(req.comId);
        let regulatoryBasis = req.body.regulatory_basis;
        let listUser = [];
        let id = Number(req.body.id);
        let check = await InfringesFors.find({ id,comId });
        let listUpdate = [];
        if (!check || check.length === 0) {
            return functions.setError(res, 'không tìm thấy data', 404)
        }
        if (req.body.list_user) {
            for (let j = 0; j < req.body.list_user.split(',').length; j++) {
                let check_user = await Users.find({ idQLC: req.body.list_user.split(',')[j] })
                if (check_user && check_user.length) {
                    listUser.push({ userId: req.body.list_user.split(',')[j], name: req.body.list_user_name.split(',')[j] });
                } else {
                    return functions.setError(res, 'not found user', 400)
                }
            }
        }
        let createdBy = req.body.created_by;
        let infringeAt = req.body.infringe_at;
        if (await functions.checkDate(infringeAt) === false || await functions.checkTime(infringeAt) === false) {
            return functions.setError(res, 'invalid infringe_at', 400)

        }
        let infringeType = req.body.infringe_type;
        let numberViolation = req.body.number_violation;
        let updatedAt = new Date();
        let depId = req.body.depId;
        let depName = req.body.depName;
        if (check[0].depId === 0) {
            listUpdate = {
                comId, regulatoryBasis, infringeAt, createdBy, infringeType, numberViolation
                , updatedAt, listUser
            }
        } else {
            listUpdate = {
                comId, regulatoryBasis, infringeAt, createdBy, infringeType, numberViolation
                , updatedAt, depId, depName
            }
        }
        if (regulatoryBasis  && createdBy && createdBy && infringeType && numberViolation) {
            await InfringesFors.findOneAndUpdate({ id: id }, listUpdate)
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'success')
    } catch (error) {
        console.log("🚀 ~ file: walfareController.js:42 ~ exports.addAchievement= ~ error:", error)
        return functions.setError(res, error)
    }
}

// danh sách kỉ luật
exports.listInfinges = async (req, res, next) => {
    try {
        let page = req.query.page;
        let pageSize = req.query.pageSize;
        let keyWords = req.query.keyWords || null;
        let type = Number(req.query.type);
        let comId = req.comId;
        if (!page || !pageSize || !type) {
            return functions.setError(res, 'missing data')
        }
        if (await functions.checkNumber(page) === false || await functions.checkNumber(pageSize) === false || await functions.checkNumber(type) === false) {
            return functions.setError(res, 'invalid Number', 400)
        }
        let skip = (page - 1) * pageSize;
        let data = [];
        let totalInfinges = 0;
        if (keyWords && type === 1) {
            data = await InfringesFors.find({ "listUser.name": { $regex: `.*${keyWords}.*` }, type: 1, comId }).skip(skip).limit(pageSize);
            totalInfinges = await InfringesFors.find({ "listUser.name": { $regex: `.*${keyWords}.*` }, type: 1, comId }).count();
            if (!data || data.length === 0) {
                data = await InfringesFors.find({ infringeName: { $regex: `.*${keyWords}.*` }, type: 1, comId }).skip(skip).limit(pageSize);
                totalInfinges = await InfringesFors.find({ infringeName: { $regex: `.*${keyWords}.*` }, type: 1, comId }).count();
            }
        }
        else if (keyWords && type === 2) {
            data = await InfringesFors.find({ "listUser.name": { $regex: `.*${keyWords}.*` }, type: 2, comId }).skip(skip).limit(pageSize);
            totalInfinges = await InfringesFors.find({ "listUser.name": { $regex: `.*${keyWords}.*` }, type: 2, comId }).count();
            if (!data || data.length === 0) {
                data = await InfringesFors.find({ infringeName: { $regex: `.*${keyWords}.*` }, comId, type: 2 }).skip(skip).limit(pageSize);
                totalInfinges = await InfringesFors.find({ infringeName: { $regex: `.*${keyWords}.*` }, type: 2, comId }).count();
            }
        }
        else if (!keyWords && type === 1) {
            data = await InfringesFors.find({ type: 1, comId }).skip(skip).limit(pageSize);
            totalInfinges = await InfringesFors.find({ type: 1, comId }).count();
        } else if (!keyWords && type === 2) {
            data = await InfringesFors.find({ type: 2, comId }).skip(skip).limit(pageSize);
            totalInfinges = await InfringesFors.find({ type: 2, comId }).count();
        } else {
            return functions.setError(res, 'invalid type', 404)
        }
        let tongSoTrang = Math.ceil(totalInfinges / pageSize)
        data.push({ tongSoTrang: tongSoTrang, tongSoBanGhi: totalInfinges })
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: walfareController.js:168 ~ exports.listAchievement= ~ error:", error)
        return functions.setError(res, error)
    }
}