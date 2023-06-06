const fnc = require('../services/functions');
const City = require('../models/City');
const District = require('../models/District');
const CategoryTv365 = require('../models/Timviec365/CategoryJob');
const TagTv365 = require('../models/Timviec365/UserOnSite/Company/Keywords');
const LangCv = require('../models/Timviec365/CV/CVLang');

// lấy danh sach thành phố
exports.getDataCity = async(req, res, next) => {
    try {
        let city = await fnc.getDatafind(City);
        if (city.length != 0) {
            return fnc.success(res, "Lấy dữ liệu thành công", { data: city })
        }
        return fnc.setError(res, 'Không có dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// lấy danh sách quận huyện theo id thành phố
exports.getDataDistrict = async(req, res, next) => {
    try {
        let idCity = req.body.cit_id;
        if (idCity != undefined) {
            let district = await fnc.getDatafind(District, { parent: idCity })
            return fnc.success(res, "Lấy dữ liệu thành công", { data: district })
        }
        return fnc.setError(res, 'Chưa truyền id tỉnh thành', 404)
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// lấy danh sách ngành nghề timviec365
exports.getDataCategoryTv365 = async(req, res, next) => {
    try {
        let active = req.body.active;
        let cat_only = req.body.cat_only;
        let condition = {};
        if (active != undefined) {
            condition.active = active;
        }
        if (cat_only != undefined) {
            condition.cat_only = cat_only;
        }
        let category = await fnc.getDatafind(CategoryTv365, condition);
        return fnc.success(res, "Lấy dữ liệu thành công", { data: category })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// Lấy danh sách tag timviec365
exports.getDataTagTv365 = async(req, res, next) => {
    try {
        let type = req.body.type;
        let condition = {};

        if (type == 'tagKey') {
            condition.name = { $ne: "" };
            condition.cbID = 0;
            condition.cityID = 0;
            condition.redirect301 = "";
        }

        lists = await TagTv365.find(condition, { name: 1 }).sort({ _id: 1 }).lean();
        return fnc.success(res, "Lấy dữ liệu thành công", { data: lists })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// lấy danh sách ngôn ngữ cv
exports.getDataLangCV = async(req, res, next) => {
    try {
        lists = await LangCv.find({}, {
            name: 1,
            alias: 1
        }).lean();
        return fnc.success(res, "Lấy dữ liệu thành công", { data: lists })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}