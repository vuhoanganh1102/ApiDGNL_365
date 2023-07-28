const fnc = require('../services/functions');
const City = require('../models/City');
const District = require('../models/District');
const CategoryTv365 = require('../models/Timviec365/CategoryJob');
const TagTv365 = require('../models/Timviec365/UserOnSite/Company/Keywords');
const LangCv = require('../models/Timviec365/CV/CVLang');
const CVDesign = require('../models/Timviec365/CV/CVDesign');
const TblModules = require('../models/Timviec365/TblModules');
const Users = require('../models/Users');
const tags = require('../models/Timviec365/TblTags');

// lấy danh sach thành phố
exports.getDataCity = async(req, res, next) => {
    try {
        const cit_id = req.body.cit_id;
        let condition = {};
        if (cit_id) {
            condition = { _id: cit_id };
        }
        let city = await fnc.getDatafind(City, condition),
            data = [];

        for (let index = 0; index < city.length; index++) {
            const element = city[index];
            data.push({
                "cit_id": element._id,
                "cit_name": element.name,
                "cit_order": element.order,
                "cit_type": element.type,
                "cit_count": element.count,
                "cit_count_vl": element.countVl,
                "cit_count_vlch": element.countVlch,
                "postcode": element.postCode
            });
        }
        return fnc.success(res, "Lấy dữ liệu thành công", { data })

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// lấy danh sách quận huyện theo id thành phố
exports.getDataDistrict = async(req, res, next) => {
    try {
        let idCity = req.body.cit_id;
        let condition = {};
        if (idCity) {
            condition.parent = idCity;
        } else {
            condition.parent = { $ne: 0 };
        }
        const lists = await fnc.getDatafind(District, condition);
        let district = [];
        for (let i = 0; i < lists.length; i++) {
            let item = lists[i];
            district.push({
                'cit_id': item._id,
                'cit_name': item.name,
                'cit_order': item.order,
                'cit_type': item.type,
                'cit_count': item.count,
                'cit_parent': item.parent
            });

        }
        return fnc.success(res, "Lấy dữ liệu thành công", { data: district })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// lấy danh sách ngành nghề timviec365
exports.getDataCategoryTv365 = async(req, res, next) => {
    try {
        const active = req.body.active;
        const cat_only = req.body.cat_only;
        const cat_id = req.body.cat_id;

        let condition = {};
        if (active) {
            condition.cat_active = active;
        }
        if (cat_only) {
            condition.cat_only = cat_only;
        }
        if (cat_id) {
            condition.cat_id = cat_id;
        }
        const category = await CategoryTv365.find(condition).sort({ cat_name: 1 });
        return fnc.success(res, "Lấy dữ liệu thành công", { data: category })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// Lấy danh sách tag timviec365
exports.getDataTagTv365 = async(req, res, next) => {
    try {
        let type = req.body.type || "tagKey",
            cate_id = req.body.cate_id || null;
        let condition = {},
            data = [];

        if (type == 'tagKey') {
            condition.key_name = { $ne: "" };
            condition.key_cb_id = 0;
            condition.key_city_id = 0;
            condition.key_301 = "";
            condition.key_time = { $ne: 1604509200 };
        }
        if (cate_id != null) {
            condition.key_name = { $ne: "" };
            condition.key_cate_lq = cate_id;
            condition.key_cb_id = 0;
            condition.key_city_id = 0;
            condition.key_cate_id = 0;
            condition.key_err = 0;
            condition.key_301 = "";
        }

        const lists = await TagTv365.aggregate([
            { $match: condition },
            { $sort: { _id: -1 } },
            {
                $project: {
                    key_id: "$_id",
                    key_name: 1,
                    key_cate_lq: 1
                }
            }
        ]);

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

// Lấy danh sách thiết kế cv
exports.getDataDesignCV = async(req, res, next) => {
    try {
        lists = await CVDesign.find({}, {
            name: 1,
            alias: 1
        }).lean();
        return fnc.success(res, "Lấy dữ liệu thành công", { data: lists })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// Lấy nội dung bảng modules để seo
exports.modules = async(req, res) => {
    try {
        const { moduleRequets } = req.body;
        if (moduleRequets) {
            const seo = await TblModules.findOne({
                module: moduleRequets
            }).lean();
            seo.sapo = await fnc.renderCDNImage(seo.sapo)
            return fnc.success(res, "Thông tin module", {
                data: seo
            });
        }
        return fnc.setError(res, "Không có tham số tìm kiếm");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }

}

exports.getDistrictTag = async(req, res) => {
    const city = req.body.city;
    const list = await TagTv365.aggregate([{
            $match: {
                key_city_id: Number(city),
                key_index: 1,
                key_name: ''
            }
        }, {
            $lookup: {
                from: 'District',
                localField: 'key_qh_id',
                foreignField: '_id',
                as: 'city'
            }
        },

        {
            $project: {
                cit_id: '$city._id',
                cit_name: '$city.name',
                cit_parent: '$city.parent'
            }
        }
    ]);
    return fnc.success(res, "Thông tin quận huyện tag", {
        list
    });

}

exports.getUserOnline = async(req, res) => {
    try {
        const { list_id, city_id, type } = req.body;
        if (list_id) {

            let project, match, list;
            if (type == 1) {
                project = {
                    usc_logo: "$avatarUser",
                    usc_company: "$userName",
                    usc_id: "$idTimViec365",
                    usc_city: "$city",
                    usc_alias: "$alias",
                    chat365_id: "$_id",
                    usc_create_time: "$createdAt"
                };
                match = {
                    _id: { $in: list_id.split(',').map(Number) },
                    usc_redirect: "",
                    type: type
                };
                list = await Users.aggregate([{
                        $match: match
                    },
                    { $sort: { _id: -1 } },
                    { $project: project }
                ]);

                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    element.usc_logo = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                    const New = await NewTV365.findOne({
                        new_user_id: element.usc_id
                    }).sort({ new_id: -1 }).limit(1).lean();
                    element.new_title = New.new_title;
                }

                return fnc.success(res, 'Danh sách online', { data: list, total: list.length });
            } else if (type == 0) {
                project = {
                    use_logo: "$avatarUser",
                    use_first_name: "$userName",
                    use_id: "$idTimViec365",
                    cv_title: "$inForPerson.candidate.cv_title",
                    cv_city_id: "$alias",
                    chat365_id: "$_id",
                };
                match = {
                    _id: { $in: list_id.split(',') },
                    "inForPerson.candidate.use_show": 1
                };
                list = await Users.aggregate([{
                        $match: match
                    },
                    { $sort: { _id: -1 } },
                    { $project: project }
                ]);
                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    element.usc_logo = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                    const New = await NewTV365.findOne({
                        new_user_id: element.usc_id
                    }).sort({ new_id: -1 }).limit(1).lean();
                    element.new_title = New.new_title;
                }
                return fnc.success(res, 'Danh sách online', { data: list, total: list.length });
            }
            return functions.setError(res, "Data không hợp lệ")
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.getTblTag = async(req, res) => {
    const list = await tags.find();
    return fnc.success(res, "danh sách tbl tag", {
        data: list
    });
}