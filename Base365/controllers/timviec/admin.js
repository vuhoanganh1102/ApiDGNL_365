const md5 = require('md5');

const Users = require('../../models/Users');
const AdminUser = require('../../models/Timviec365/Admin/AdminUser');
const Modules = require('../../models/Timviec365/Admin/Modules');
const functions = require('../../services/functions');
const AdminUserRight = require('../../models/Timviec365/Admin/AdminUserRight');
const AdminTranslate = require('../../models/Timviec365/Admin/AdminTranslate');
const {recordCreditsHistory} = require("./credits");
const PointCompany = require("../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany")
const GhimTinPackages = require("../../models/Timviec365/UserOnSite/Company/GhimTinPackages")

// Đăng nhập
exports.login = async(req, res) => {
    const { adm_loginname, adm_password } = req.body;
    const result = await AdminUser.findOne({
        adm_loginname: adm_loginname,
        adm_password: md5(adm_password)
    }).select('adm_id').lean();
    if (result) {
        return functions.success(res, 'thành công', {
            adm_id: result.adm_id
        });
    }
    return functions.setError(res, 'vui lòng thử lại');
}

exports.translate = async(req, res) => {
    const list = await AdminTranslate.find();
    return functions.success(res, "", { data: list });
}

// hàm lấy dữ liệu modules
exports.getModules = async(req, res, next) => {
    try {
        const { isAdmin, user_id } = req.body;
        if (isAdmin == 1) {
            let modules = await Modules.find().sort({ mod_order: 1 }).lean();
            return functions.success(res, 'lấy dữ liệu thành công', {
                modules
            })
        } else {
            return functions.setError(res, '123');
        }


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

exports.accessmodule = async(req, res) => {
    try {
        const { userlogin, password, module_id } = req.body;
        const check = await AdminUserRight.aggregate([{
            $lookup: {
                from: "AdminUser",
                localField: "adu_admin_id",
                foreignField: "adm_id",
                as: "admin"
            }
        }, {
            $unwind: "$admin"
        }, {
            $match: {
                "admin.adm_loginname": userlogin,
                "admin.adm_password": password,
                "admin.adm_active": 1,
                "admin.adm_delete": 0,
            }
        }, {
            $lookup: {
                from: "modules",
                localField: "adu_admin_module_id",
                foreignField: "mod_id",
                as: "modules",
            }
        }, {
            $unwind: "$modules"
        }, {
            $match: {
                "modules.mod_id": module_id
            }
        }, {
            $project: {
                module_id: "$modules.mod_id"
            }
        }]);
        return functions.success(res, "...", { check });
    } catch (error) {
        return functions.setError(res, error);
    }
}

// Lấy thông tin admin qua trường id bộ phận và không cần đăng nhập
exports.getInfoAdminUser = async(req, res) => {
    const adm_bophan = req.body.adm_bophan;
    if (adm_bophan) {
        const admin = await AdminUser.findOne({ adm_bophan: adm_bophan }).lean();
        return functions.success(res, "Thông tin KD", { admin });
    }
    return functions.setError(res, "Chưa truyền adm_bophan");
}

exports.infor = async(req, res) => {
    const { adm_id } = req.body;
    const admin = await AdminUser.findOne({ adm_id: adm_id }).lean();
    return functions.success(res, "Thông tin KD", { admin });
}

exports.bophan_list = async(req, res) => {
    const list = await AdminUser.find({
        adm_bophan: { $ne: 0 }
    }).sort({
        adm_bophan: 1
    }).lean();
    return functions.success(res, "Thông tin KD", { data: list });
}


exports.listingCompany = async(req, res) => {
    let condition = {
        type: 1,
        "inForCompany.timviec365.usc_md5": ""
    };
    const list = await Users.find(condition).limit(30).lean();
    const count = await Users.countDocuments(condition);
    return functions.success(res, "Thông tin KD", {
        data: {
            list,
            count
        }
    });
}

// hàm đăng ký 
exports.postAdmin = async(req, res, next) => {
        try {
            let request = req.body,
                loginName = request.loginName,
                name = request.name,
                phone = request.phone,
                password = request.password,
                email = request.email,
                modules = request.modules,
                allCategory = request.allCategory,
                category = request.accessCategory,
                langID = requestlangID;
            if (loginName && name && phone && password && email) {
                let checkEmail = await functions.checkEmail(email);
                let checkPhone = await functions.checkPhoneNumber(phone);
                if (checkEmail && checkPhone) {
                    let admin = await functions.getDatafindOne(AdminUser, { loginName });
                    if (admin == null) {
                        let maxID = await functions.getMaxID(AdminUser) || 0;
                        if (category && category.length == 0) {
                            category = null;
                        }
                        if (modules && modules.length > 0) {
                            for (let i = 0; i < modules.length; i++) {
                                let maxIDModules = await functions.getMaxID(AdminUserRight) || 0;
                                let adminRight = new AdminUserRight({
                                    _id: Number(maxIDModules) + 1,
                                    adminID: Number(maxID) + 1,
                                    adminModule: modules[i].adminModule,
                                    add: modules[i].add,
                                    edit: modules[i].edit,
                                    delete: modules[i].delete,
                                })
                                await adminRight.save();
                            }
                        }
                        let adminUser = new AdminUser({
                            _id: Number(maxID) + 1,
                            loginName: loginName,
                            password: md5(password),
                            name: name,
                            email: email,
                            active: 0,
                            allCategory: allCategory || 0,
                            accessCategory: JSON.stringify(category) || null,
                            langID: langID || 1,
                        })
                        await adminUser.save();
                        return functions.success(res, 'thêm mới thành công')
                    }
                    return functions.setError(res, 'tên đăng nhập đã tồn tại', 404)
                }
                return functions.setError(res, 'email hoặc sô điện thoại không đúng định dạng', 404)
            }
            return functions.setError(res, 'không đủ dữ liệu', 404)
        } catch (error) {
            console.log(error)
            return functions.setError(res, error)
        }
    }
    // hàm cập nhập admin 
exports.updateAdmin = async(req, res, next) => {
        try {
            let idAdmin = req.user.data._id;
            let request = req.body,
                name = request.name,
                phone = request.phone,
                password = request.password,
                email = request.email,
                modules = request.modules,
                allCategory = request.allCategory,
                category = request.accessCategory;
            let checkAdmin = await functions.getDatafindOne(AdminUser, { _id: idAdmin });
            if (checkAdmin) {
                if (name && phone && password && email) {
                    let checkEmail = await functions.checkEmail(email);
                    let checkPhone = await functions.checkPhoneNumber(phone);
                    if (checkEmail && checkPhone) {
                        if (category && category.length == 0) {
                            category = null;
                        }
                        if (modules && modules.length > 0) {
                            await AdminUserRight.deleteMany({ adminID: idAdmin });
                            for (let i = 0; i < modules.length; i++) {
                                let maxIDModules = await functions.getMaxID(AdminUserRight) || 0;
                                let adminRight = new AdminUserRight({
                                    _id: Number(maxIDModules) + 1,
                                    adminID: idAdmin,
                                    adminModule: modules[i].adminModule,
                                    add: modules[i].add,
                                    edit: modules[i].edit,
                                    delete: modules[i].delete,
                                })
                                await adminRight.save();
                            }
                        }
                        await AdminUser.updateOne({ _id: idAdmin }, {
                            $set: {
                                loginName: loginName,
                                password: md5(password),
                                name: name,
                                email: email,
                                active: 0,
                                allCategory: allCategory || 0,
                                accessCategory: JSON.stringify(category) || null,
                            }
                        });
                        return functions.success(res, 'cập nhập thành công')
                    }
                    return functions.setError(res, 'email hoặc sô điện thoại không đúng định dạng', 404)
                }
                return functions.setError(res, 'không đủ dữ liệu', 404)
            }
            return functions.setError(res, 'tài khoản không tồn tại', 404)

        } catch (error) {
            console.log(error)
            return functions.setError(res, error)
        }
    }
    // hàm lấy thông tin chi tiết admin
exports.getAdminDetail = async(req, res, next) => {
    try {
        let id = req.user.data._id;
        if (idAdmin) {
            let admin = await functions.getDatafindOne(AdminUser, { _id: id });
            if (admin) {
                return functions.success(res, 'lấy dữ liệu thành công', admin)
            }
            return functions.setError(res, 'admin không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};
// hàm lấy danh sách admin
exports.getListAdmin = async(req, res, next) => {
        try {
            let listADmin = await functions.getDatafind(AdminUser);
            return functions.success(res, 'lấy dữ liệu thành công', listADmin)

        } catch (error) {
            console.log(error)
            return functions.setError(res, error)
        }
    }
    // hàm xóa admin
exports.deleteAdmin = async(req, res, next) => {
        try {
            let id = req.user.data._id;
            if (id) {
                await AdminUser.deleteOne({ _id: id });
                let adminRight = await functions.getDatafind(AdminUserRight, { adminID: id })
                if (adminRight.length > 0) {
                    await AdminUserRight.deleteMany({ adminID: id });
                }
                return functions.success(res, 'xóa thành công')
            }
        } catch (error) {
            console.log(error)
            return functions.setError(res, error)
        }
    }
    // hàm cập nhập active
exports.updateActive = async(req, res, next) => {
        try {
            let id = req.user.data._id;
            let active = req.body.active;
            if (id) {
                let admin = await functions.getDatafindOne(AdminUser, { _id: id })
                if (admin) {
                    await AdminUser.updateOne({ _id: id }, {
                        $set: {
                            active: active,
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'admin không tồn tại', 404)
            }
            return functions.setError(res, 'không đủ dữ liệu', 404)
        } catch (error) {
            console.log(error)
            return functions.setError(res, error)
        }
    }
    // hàm đổi mật khẩu 
exports.updatePassword = async(req, res, next) => {
    try {
        let id = req.user.data._id;
        let password = req.body.password;
        if (id) {
            let admin = await functions.getDatafindOne(AdminUser, { _id: id })
            if (admin) {
                await AdminUser.updateOne({ _id: id }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'admin không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// luồng ứng viên
exports.candi_register = async(req, res) => {
    try {
        let condition = {
            fromDevice: { $nin: [4, 7] },
            type: 0,
            fromWeb: { $in: ["timviec365", "dev.timviec365"] }
        };
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        const use_id = req.body.use_id;
        if (use_id != 0) {
            condition.idTimViec365 = Number(use_id);
        }
        const use_first_name = req.body.use_first_name;
        if (use_first_name != 0) {
            // condition.use_first_name = { $regex: use_first_name };
        }
        const list = await Users.aggregate([
            { $match: condition },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    use_id: "$idTimViec365",
                    use_logo: "$avatarUser",
                    use_create_time: "$createdAt",
                    use_first_name: "$userName",
                    use_gioi_tinh: "$inForPerson.account.gender" || null,
                    use_phone: "$phone",
                    use_email: "$email",
                    cv_title: "$inForPerson.candidate.cv_title",
                    use_address: "$address",
                    dk: "$fromDevice",
                    use_view: "$inForPerson.candidate.use_view",
                    use_phone_tk: "$phoneTK",
                    user_xac_thuc: "$otp" || null,
                    use_authentic: "$authentic",
                }
            }
        ]);
        const count = await Users.countDocuments(condition);
        return functions.success(res, "Danh sách", {
            data: {
                list,
                count
            }
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.topupCredits = async (req, res) => {
    try {
        let {
            usc_id,
            amount
        } = req.body;
        let idAdmin = req.user.data._id;
        let checkAdmin = await functions.getDatafindOne(AdminUser, { _id: idAdmin });
        if (checkAdmin) {
            if (usc_id&&amount) {
                let company = await Users.findOne({idTimViec365: usc_id, type: 1});
                if (company) {
                    let doc = await PointCompany.findOne({usc_id});
                    if (!doc) {
                        doc = await (new PointCompany({
                            usc_id: usc_id,
                            usc_money: amount,
                        })).save();
                    } else {
                        await PointCompany.findOneAndUpdate({usc_id}, {$inc: {usc_money: amount}});
                    }
                    await recordCreditsHistory(usc_id, 1, amount, idAdmin, getIP(req));
                    return functions.success(res, "Nạp tiền thành công!")
                } else {
                    return functions.setError(res, "Không tồn tại công ty có ID này", 400);
                }
            } else {
                return functions.setError(res, "Thiếu các trường cần thiết", 429);
            }
        } else {
            return functions.setError(res, 'Bạn không có quyền thực hiện hành động này!', 403)
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}
//Thêm gói ghim tin
exports.createGhimTinPackage = async (req, res) => {
    try {
        let {
            name,
            price,
            duration
        } = req.body;

        // let idAdmin = req.user.data._id;
        // let checkAdmin = await functions.getDatafindOne(AdminUser, { _id: idAdmin });
        //TODO: REMOVE THIS
        let checkAdmin = true;
        if (checkAdmin) {
            let doc = await (new GhimTinPackages({
                name,
                price,
                duration
            })).save();
            return functions.success(res, "Thêm gói ghim tin thành công", {data: doc})
        } else {
            return functions.setError(res, 'Bạn không có quyền thực hiện hành động này!', 403)
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

//Thêm gói ghim tin
exports.deleteGhimTinPackage = async (req, res) => {
    try {
        let {
            id
        } = req.params;
        // let idAdmin = req.user.data._id;
        // let checkAdmin = await functions.getDatafindOne(AdminUser, { _id: idAdmin });
        //TODO: REMOVE THIS
        let checkAdmin = true;
        if (checkAdmin) {
            let doc = await GhimTinPackages.findByIdAndDelete(id);
            return functions.success(res, "Xóa gói ghim tin thành công", {data: doc})
        } else {
            return functions.setError(res, 'Bạn không có quyền thực hiện hành động này!', 403)
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}