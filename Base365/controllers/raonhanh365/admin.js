const functions = require('../../services/functions');
const AdminUser = require('../../models/Raonhanh365/Admin/AdminUser');
const Category = require('../../models/Raonhanh365/Category');
const News = require('../../models/Raonhanh365/New');
const PriceList = require('../../models/Raonhanh365/PriceList');
const Users = require('../../models/Users');
const History = require('../../models/Raonhanh365/History');
const Blog = require('../../models/Raonhanh365/Admin/Blog');
const ReportNews = require('../../models/Raonhanh365/NewReport');
const NetworkOperator = require('../../models/Raonhanh365/NetworkOperator')
const AdminUserRight = require('../../models/Raonhanh365/Admin/AdminUserRight');

const serviceRN = require('../../services/raoNhanh365/service');
const folderImg = "img_blog";
const md5 = require('md5');
const Cart = require("../../models/Raonhanh365/Cart");
const RegisterFail = require('../../models/Raonhanh365/RegisterFail');
const NewReport = require('../../models/Raonhanh365/NewReport');
const New = require('../../models/Raonhanh365/New');
const Order = require('../../models/Raonhanh365/Order');
const Module = require('../../models/Raonhanh365/Admin/Module');
const AdminUserLanguagues = require('../../models/Raonhanh365/Admin/AdminUserLanguagues');
const Language = require('../../models/Raonhanh365/Language');
const TagIndex = require('../../models/Raonhanh365/TagIndex');

//đăng nhập admin
exports.loginAdminUser = async (req, res, next) => {
    try {
        if (req.body.loginName && req.body.password) {
            const loginName = req.body.loginName
            const password = req.body.password
            let findUser = await functions.getDatafindOne(AdminUser, { loginName })
            if (findUser) {
                let checkPassword = await functions.verifyPassword(password, findUser.password)
                if (checkPassword) {
                    let updateUser = await functions.getDatafindOneAndUpdate(AdminUser, { loginName }, {
                        date: new Date(Date.now())
                    }, { new: true });
                    const token = await functions.createToken(updateUser, "1d")
                    return functions.success(res, 'Đăng nhập thành công', { token: token })
                }
                return functions.setError(res, "Mật khẩu sai", 406);
            }
            return functions.setError(res, "không tìm thấy tài khoản trong bảng admin user", 405)
        }
        return functions.setError(res, "Missing input value!", 404)
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.changePasswordAdminLogin = async (req, res, next) => {
    try {
        let idAdmin = req.infoAdmin._id;
        let findUser = await AdminUser.findOne({ _id: idAdmin });
        if (findUser) {
            const oldPass = req.body.oldPass;
            const newPass = req.body.newPass;
            if (oldPass && newPass) {
                let checkPassword = await functions.verifyPassword(oldPass, findUser.password)
                if (checkPassword) {
                    let updatePassword = await AdminUser.findOneAndUpdate({ _id: idAdmin }, {
                        password: md5(newPass),
                    }, { new: true });
                    if (updatePassword) {
                        return functions.success(res, "Update password success!");
                    }
                    return functions.setError(res, "Update password fail!", 407);
                }
                return functions.setError(res, "Wrong password!", 406);
            }
            return functions.setError(res, "Missing input value!", 405);
        }
        return functions.setError(res, "Admin not found!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.changeInfoAdminLogin = async (req, res, next) => {
    try {
        let idAdmin = req.infoAdmin._id;
        let findUser = await AdminUser.findOne({ _id: idAdmin });
        if (findUser) {
            let email = req.body.email;
            if (email) {
                let updateInfo = await AdminUser.findOneAndUpdate({ _id: idAdmin }, {
                    email: email,
                }, { new: true });
                if (updateInfo) {
                    return functions.success(res, "Update info admin success!");
                }
                return functions.setError(res, "Update info admin fail!", 407);
            }
            return functions.setError(res, "Admin not found!", 405);
        }
        return functions.setError(res, "Admin not found!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.getListAdminUser = async (req, res, next) => {
    try {
        let { idAdmin, page, pageSize } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let condition = { delete: 0 };
        if (idAdmin) condition._id = Number(idAdmin);
        let listAdminUser = await functions.pageFind(AdminUser, condition, { loginName: 1, active: -1 }, skip, limit);

        // lap qua danh sach user
        for (let i = 0; i < listAdminUser.length; i++) {
            let adminUserRight = await AdminUserRight.find({ adminId: listAdminUser[i]._id });
            let arrIdModule = [],
                arrRightAdd = [],
                arrRightEdit = [],
                arrRightDelete = [];
            let arrNameModule = "";
            let arrAdminLanguage = [];

            for (let j = 0; j < adminUserRight.length; j++) {
                let nameModule = await Module.findOne({ _id: adminUserRight[j].moduleId }, { _id: 1, name: 1 });
                arrIdModule.push(adminUserRight[j].moduleId);
                if (nameModule) {
                    if (arrNameModule != "") {
                        arrNameModule = `${arrNameModule}, ${nameModule.name}`;
                    } else {
                        arrNameModule = nameModule.name;
                    }
                }
                arrRightAdd.push(adminUserRight[j].add);
                arrRightEdit.push(adminUserRight[j].edit);
                arrRightDelete.push(adminUserRight[j].delete);
            }
            let adminLanguage = await AdminUserLanguagues.find({ adminId: listAdminUser[i]._id });
            let nameLanguage = "";
            for (let j = 0; j < adminLanguage.length; j++) {
                let nameL = await Language.findOne({ _id: adminLanguage[j].langId });
                if (nameL) {
                    if (nameLanguage != "") nameLanguage = `${nameLanguage}, ${nameL.name}`;
                    else nameLanguage = nameL.name;
                }

            }
            let adminUser = listAdminUser[i];
            let tmpOb = { adminUser, arrIdModule, arrNameModule, arrRightAdd, arrRightEdit, arrRightDelete, adminLanguage, nameLanguage };
            listAdminUser[i] = tmpOb;

        }
        const totalCount = await functions.findCount(AdminUser, condition);
        return functions.success(res, "get list blog success", { totalCount: totalCount, data: listAdminUser });
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.listModule = async (req, res, next) => {
    try {
        let listModule = await Module.find({}).sort({ order: -1 });
        return functions.success(res, "Get list module success", { data: listModule });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.getSideBar = async (req, res, next) => {
    try {
        let idAdmin = req.infoAdmin._id;
        let admin = await AdminUser.findOne({ _id: idAdmin }).lean();
        if (admin) {
            let adminRight;
            if (admin.isAdmin != 1) {
                adminRight = await AdminUserRight.aggregate([
                    { $match: { adminId: idAdmin } },
                    {
                        $lookup: {
                            from: "RN365_Module",
                            localField: "moduleId",
                            foreignField: "_id",
                            as: "Module"
                        }
                    },
                    { $unwind: { path: "$Module", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            "moduleId": "$moduleId",
                            "add": "$add",
                            "edit": "$edit",
                            "delete": "$delete",
                            "nameM": "$Module.name",
                            "pathM": "$Module.path",
                            "listNameM": "$Module.listName",
                            "listFileM": "$Module.listFile",
                            "langIdM": "$Module.langId",
                            "checkLocaM": "$Module.checkLoca",
                        }
                    },
                    { $sort: { moduleId: 1 } }
                ]);

            } else {
                adminRight = await Module.find({}).sort({ order: 1 });
            }
            admin = { ...admin, adminRight };
            return functions.success(res, "Get list module success", { admin });
        }
        return functions.setError(res, "Admin not found!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        let idAdmin = req.body.idAdmin;
        let password = req.body.password;
        if (idAdmin && password) {
            let updatePassword = await AdminUser.findOneAndUpdate({ _id: idAdmin }, { password: md5(password) }, { new: true });
            if (updatePassword) {
                return functions.success(res, "Update password success");
            }
            return functions.setError(res, "Change password fail", 405);
        }
        return functions.setError(res, "Missing input idAdmin", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.activeAdmin = async (req, res, next) => {
    try {

    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.createAdminUser = async (req, res, next) => {
    try {
        let { loginName, password, name, phone, email, editAll, allCategory, arrLangId, accessModule, arrIdModule, arrRightAdd, arrRightEdit, arrRightDelete } = req.body;
        if (loginName && password && phone && email) {
            let maxIdAdmin = await functions.getMaxIdByField(AdminUser, '_id');
            let adminId = req.infoAdmin._id;
            password = md5(password);
            let fields = {
                _id: maxIdAdmin,
                loginName,
                password,
                name,
                phone,
                email,
                editAll,
                allCategory,
                langId: 1,
                active: 1,
                adminId: adminId
            }
            let adminUser = new AdminUser(fields);
            adminUser = await adminUser.save();
            if (adminUser) {
                arrIdModule = arrIdModule.split(",");
                arrRightAdd = arrRightAdd.split(",");
                arrRightEdit = arrRightEdit.split(",");
                arrRightDelete = arrRightDelete.split(",");
                for (let i = 0; i < arrIdModule.length; i++) {
                    //tao id cho bang phan quyen
                    let newIdAdminUserRight = await functions.getMaxIdByField(AdminUserRight, '_id');
                    let fieldsRight = {
                        _id: newIdAdminUserRight,
                        adminId: maxIdAdmin,
                        moduleId: arrIdModule[i],
                        add: arrRightAdd[i],
                        edit: arrRightEdit[i],
                        delete: arrRightDelete[i]
                    }
                    let adminUserRight = new AdminUserRight(fieldsRight);
                    await adminUserRight.save();
                }
                arrLangId = arrLangId.split(",");
                for (let i = 0; i < arrLangId.length; i++) {
                    let newIdLang = await functions.getMaxIdByField(AdminUserLanguagues, '_id');
                    let languagueAdmin = new AdminUserLanguagues({
                        _id: newIdLang,
                        adminId: maxIdAdmin,
                        langId: arrLangId[i]
                    });
                    await languagueAdmin.save();
                }
                return functions.success(res, 'Create AdminUser and AdminUserRight RN365 success!');
            }
            return functions.setError(res, "Insert info adminUser fail!");
        }
        return functions.setError(res, "Missing input password!");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.updateAdminUser = async (req, res, next) => {
    try {
        let { _id, name, phone, email, editAll, allCategory, arrLangId, accessModule, arrIdModule, arrRightAdd, arrRightEdit, arrRightDelete } = req.body;
        let adminId = req.infoAdmin._id;
        if (_id && name && phone && email) {
            let fields = {
                name,
                phone,
                email,
                editAll,
                allCategory,
                langId: 1,
                adminId: adminId
            }
            let adminUser = await AdminUser.findOneAndUpdate({ _id: _id }, fields, { new: true });
            if (adminUser) {
                await AdminUserRight.deleteMany({ adminId: _id });

                arrIdModule = arrIdModule.split(",");
                arrRightAdd = arrRightAdd.split(",");
                arrRightEdit = arrRightEdit.split(",");
                arrRightDelete = arrRightDelete.split(",");
                for (let i = 0; i < arrIdModule.length; i++) {
                    //tao id cho bang phan quyen
                    let newIdAdminUserRight = await functions.getMaxIdByField(AdminUserRight, '_id');
                    let fieldsRight = {
                        _id: newIdAdminUserRight,
                        adminId: _id,
                        moduleId: arrIdModule[i],
                        add: arrRightAdd[i],
                        edit: arrRightEdit[i],
                        delete: arrRightDelete[i]
                    }
                    let adminUserRight = new AdminUserRight(fieldsRight);
                    await adminUserRight.save();
                }
                //xoa du lieu hien tai
                await AdminUserLanguagues.deleteMany({ adminId: _id });

                //them moi
                arrLangId = arrLangId.split(",");
                for (let i = 0; i < arrLangId.length; i++) {
                    let newIdLang = await functions.getMaxIdByField(AdminUserLanguagues, '_id');
                    let languagueAdmin = new AdminUserLanguagues({
                        _id: newIdLang,
                        adminId: _id,
                        langId: arrLangId[i]
                    });
                    await languagueAdmin.save();
                }
                return functions.success(res, 'Update AdminUser and AdminUserRight RN365 success!');
            }
            return functions.setError(res, "Admin user not found!");
        }
        return functions.setError(res, "Missing input value!");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.deleteAdminUser = async (req, res, next) => {
    try {
        let adminId = req.body.adminId;
        if (adminId) {
            adminId = Number(adminId);
            let user = await functions.getDataDeleteOne(AdminUser, { _id: adminId });
            if (user.deletedCount === 1) {
                return functions.success(res, `Delete user with _id=${adminId} success`);
            } else {
                return functions.success(res, "User not found");
            }
        }
        return functions.setError(res, "Missing input adminId", 500);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//-----------------------------------------------------------controller quan ly danh muc----------------------------------------------------------------

// lay ra danh sach
exports.getListCategory = async (req, res, next) => {
    try {
        let { _id, name, parentId } = req.body;
        let condition = {};
        if (_id) condition._id = Number(_id);
        if (name) condition.name = new RegExp(name, 'i');
        if (parentId) condition.parentId = parentId;
        const listCategoryParent = await Category.find(condition).sort({ type: 1 }).lean();
        for (let i = 0; i < listCategoryParent.length; i++) {
            let categoryChild = await Category.find({ parentId: listCategoryParent[i]._id });
            listCategoryParent[i].categoryChild = categoryChild;
        }
        const totalCount = await functions.findCount(Category, condition);
        return functions.success(res, "get list category success", { totalCount: totalCount, data: listCategoryParent });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.getAndCheckDataCategory = async (req, res, next) => {
    try {
        let { parentId, name, order, description } = req.body;
        let adminId = req.infoAdmin._id;
        if (name && order) {
            // them cac truong muon them hoac sua
            req.info = {
                parentId: parentId,
                adminId: adminId,
                name: name,
                active: 1,
                show: 1,
                order: order,
                description: description
            }
            return next();
        }
        if (parentId > 0) {
            await Category.findOneAndUpdate({ _id: parentId }, { hasChild: 1 }, { new: true });
        }
        return functions.setError(res, "Missing input value", 404)
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.createCategory = async (req, res, next) => {
    try {
        let fields = req.info;
        let newIdCategory = await functions.getMaxIdByField(Category, '_id');
        fields._id = newIdCategory;
        let category = new Category(fields);
        await category.save();
        return functions.success(res, 'Create category RN365 success!');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.updateCategory = async (req, res, next) => {
    try {
        let cateID = req.body.cateID;
        if (cateID) {
            let fields = req.info;
            let existsCategory = await Category.findOne({ _id: cateID });
            if (existsCategory) {

                await Category.findOneAndUpdate({ _id: cateID }, fields);
                return functions.success(res, "Category edited successfully");
            }
            return functions.setError(res, "Category not found!", 505);
        }
        return functions.setError(res, "Missing input value id cate!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.activeAndShowCategory = async (req, res, next) => {
    try {
        let { cateID, active, show } = req.body;
        if (cateID) {
            let updateCategory = await Category.findOneAndUpdate({ _id: cateID }, { active: active, show: show }, { new: true });
            if (updateCategory) {
                return functions.success(res, "Active or show success!");
            }
            return functions.setError(res, "Category not found!", 405);
        }
        return functions.setError(res, "Missing input value id cate!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//---------------------------------------------------------controller quan ly tin(tin rao vat, tin mua)-----------------------------------------------
//-------gom ca quan ly tin tuyen dung va tin tim viec lam -----> bang cach su dung truong cateID de phan biet

//api lay ra danh sach va tim kiem tin
// khi truyen cateID = 120, 121 se lay dc tin tuyen dung va tin tim viec lam
exports.getListNews = async (req, res, next) => {
    try {
        let { page, pageSize, _id, buySell, title, cateID, email, fromDate, toDate } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        //lay cac tham so dieu kien tim kiem tin

        let condition = {};
        if (buySell) condition.buySell = Number(buySell); // 1: tin mua, 2: tin ban
        if (_id) condition._id = Number(_id);
        if (title) condition.title = new RegExp(title, 'i');
        if (cateID) condition.cateID = Number(cateID); // cate
        if (email) condition.email = new RegExp(email, 'i');

        // tu ngay den ngay
        if (fromDate && !toDate) condition.createTime = { $gte: new Date(fromDate) };
        if (toDate && !fromDate) condition.createTime = { $lte: new Date(toDate) };
        if (toDate && fromDate) condition.createTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };
        let fields = { _id: 1, title: 1, linkTitle: 1, description: 1, img: 1, cateID: 1, createTime: 1, active: 1, city: 1, userID: 1, email: 1, updateTime: 1 };
        let listNews = await News.aggregate([
            { $match: condition },
            {
                $lookup: {
                    from: "Users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "matchedDocuments"
                }
            },
            { $project: fields },
            { $sort: { _id: 1 } },
            { $skip: skip },
            { $limit: limit }
        ])
        const totalCount = await News.countDocuments(condition);
        return functions.success(res, 'Get list news success', { totalCount, listNews });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.getAndCheckDataNews = async (req, res, next) => {
    try {
        let { title, description, money } = req.body;
        if (title && description) {
            // them cac truong muon them hoac sua
            req.info = {
                title: title,
                description: description,
                money: money
            }
            return next();
        }
        return functions.setError(res, "Missing input value", 404)
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.createNews = async (req, res, next) => {
    try {
        let fields = req.info;
        let newIdNews = await functions.getMaxIdByField(News, '_id');

        fields._id = newIdNews;
        fields.createTime = Date(Date.now());
        let news = new News(fields);
        await news.save();
        return functions.success(res, 'Create news RN365 success!');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.updateNews = async (req, res, next) => {
    try {
        let newsID = req.body.newsID;
        if (newsID) {
            let fields = req.info;
            fields.updateTime = Date(Date.now());
            let existsNews = await News.findOne({ _id: newsID });
            if (existsNews) {
                await News.findOneAndUpdate({ _id: newsID }, fields);
                return functions.success(res, "News edited successfully");
            }
            return functions.setError(res, "News not found!", 505);
        }
        return functions.setError(res, "Missing input value id news!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.deleteNews = async (req, res, next) => {
    try {
        let newsID = req.body.newsID;
        if (newsID) {
            newsID = Number(newsID);
            let news = await functions.getDataDeleteOne(News, { _id: newsID });
            if (news.deletedCount === 1) {
                return functions.success(res, `Delete news with _id=${newsID} success`);
            } else {
                return functions.success(res, "News not found");
            }
        }
        return functions.setError(res, "Missing input newsID", 500);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//---------------------------------------------------------controller quan ly bang gia-----------------------------------------------

//api lay ra danh sach va tim kiem tin
exports.getListPriceList = async (req, res, next) => {
    try {
        //lay cac tham so dieu kien tim kiem tin
        let { _id, time, type } = req.body;

        let condition = {};
        if (_id) condition._id = Number(_id);
        if (type) condition.type = Number(type);
        if (time) condition.time = new RegExp(time);
        let fields = { _id: 1, time: 1, unitPrice: 1, discount: 1, intoMoney: 1, vat: 1, intoMoneyVat: 1 };

        let listPriceList = await PriceList.find(condition, fields);
        return functions.success(res, 'Get list PriceList success', { data: listPriceList })
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.update = async (req, res, next) => {
    try {
        let newsID = req.body.newsID;
        if (newsID) {
            newsID = Number(newsID);
            let fields = req.info;
            fields.updateTime = Date(Date.now());
            let existsNews = await News.findOne({ _id: newsID });
            if (existsNews) {

                await News.findOneAndUpdate({ _id: newsID }, fields);
                return functions.success(res, "News edited successfully");
            }
            return functions.setError(res, "News not found!", 505);
        }
        return functions.setError(res, "Missing input value id news!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}


//-------------------------------------------------------controller quan ly tai khoan(da xac nhan opt va chua xac nhan)tk gian hang-------------------------

exports.getListUser = async (req, res, next) => {
    try {
        let { idRaoNhanh365, authentic, userName, email, phoneTK, fromDate, toDate, page, pageSize } = req.body;
        //authentic => phan biet tai khoan bt va tk gian hang(xac thuc va chua xac thuc)
        if (!page) page = 1;
        if (!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        //
        let condition = {};
        if (idRaoNhanh365) condition.idRaoNhanh365 = Number(idRaoNhanh365);
        if (authentic) condition.authentic = Number(authentic);
        if (userName) condition.userName = new RegExp(userName);
        if (email) condition.email = new RegExp(email);
        if (phoneTK) condition.phoneTK = new RegExp(phoneTK);

        if (fromDate && !toDate) condition.updatedAt = { $gte: new Date(fromDate) };
        if (toDate && !fromDate) condition.updatedAt = { $lte: new Date(toDate) };
        if (toDate && fromDate) condition.updatedAt = { $gte: new Date(fromDate), $lte: new Date(toDate) };

        let fields = { avatarUser: 1, idRaoNhanh365: 1, userName: 1, authentic: 1, email: 1, phoneTK: 1, createdAt: 1, "inforRN365.money": 1 };

        let listUsers = await functions.pageFindWithFields(Users, condition, fields, { _id: 1 }, skip, limit);
        const totalCount = await Users.countDocuments(condition);
        return functions.success(res, 'Get list news success', { totalCount, listUsers })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}


exports.getAndCheckDataUser = async (req, res, next) => {
    try {
        let { userName, email, phoneTK, phone, money, cong, tru } = req.body;

        if (userName && phoneTK) {
            // them cac truong muon them hoac sua
            req.info = {
                userName: userName,
                phoneTK: phoneTK,
                email: email,
                phone: phone,
                "inforRN365.money": Number(money) + Number(cong) - Number(tru)
            }
            return next();
        }
        return functions.setError(res, "Missing input value", 404)
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.createUser = async (req, res, next) => {
    try {
        let fields = req.info;

        let newIdUser = await functions.getMaxIdByField(Users, 'idRaoNhanh365');
        fields.idRaoNhanh365 = newIdUser;
        fields.createdAt = Date(Date.now());
        let news = new Users(fields);
        await news.save();
        return functions.success(res, 'Create news RN365 success!');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        let userID = req.body.userID;
        if (userID) {
            let fields = req.info;
            fields.updateAt = Date(Date.now());
            let existsUser = await Users.findOne({ idRaoNhanh365: userID });
            if (existsUser) {
                await Users.findOneAndUpdate({ idRaoNhanh365: userID }, fields);
                return functions.success(res, "User edited successfully");
            }
            return functions.setError(res, "User not found!", 505);
        }
        return functions.setError(res, "Missing input value id user!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        let userID = req.body.userID;
        if (userID) {
            userID = Number(userID);
            let user = await functions.getDataDeleteOne(Users, { idRaoNhanh365: userID });
            if (user.deletedCount === 1) {
                return functions.success(res, `Delete user with idRaoNhanh365=${userID} success`);
            } else {
                return functions.success(res, "User not found");
            }
        }
        return functions.setError(res, "Missing input userID", 500);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//------------------tin spam
exports.getListNewsSpam = async (req, res, next) => {
    try {
        let { page, pageSize, fromDate, toDate } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 20;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        let condition = { duplicate: { $ne: "" } };
        if (fromDate && !toDate) condition.createTime = { $gte: new Date(fromDate) };
        if (!fromDate && toDate) condition.createTime = { $lte: new Date(toDate) };
        if (fromDate && toDate) condition.createTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };

        let fields = { _id: 1, title: 1, linkTitle: 1, createTime: 1, img: 1, active: 1, duplicate: 1, userID: 1, cateID: 1 };
        let total = await functions.findCount(News, condition);
        let listNewsSpam = await functions.pageFindWithFields(News, condition, fields, { _id: 1 }, skip, pageSize);
        return functions.success(res, "Get list news spam success:", { total, data: listNewsSpam });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//-------------------------------------------------------controller lich su nap the -------------------------

exports.getListHistory = async (req, res, next) => {
    try {
        //lay cac tham so dieu kien tim kiem tin
        let { page, pageSize, _id, userName, userId, seri, fromDate, toDate } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        //lay cac tham so dieu kien tim kiem tin

        let condition = {};

        if (fromDate && !toDate) condition.createTime = { $gte: new Date(fromDate) };
        if (toDate && !fromDate) condition.createTime = { $lte: new Date(toDate) };
        if (toDate && fromDate) condition.createTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };
        if (_id) condition._id = Number(_id);
        if (userName) condition.userName = new RegExp(userName, 'i');
        if (userId) condition.userId = new Number(userId);
        if (seri) condition.seri = new RegExp(seri, 'i');
        let fields = { _id: 1, userId: 1, seri: 1, time: 1, price: 1 };
        let listHistory = await History.aggregate([
            { $sort: { _id: 1 } },
            { $skip: skip },
            { $limit: limit },
            { $match: condition },
            {
                $lookup: {
                    from: "Users",
                    localField: "userId",
                    foreignField: "idRaoNhanh365",
                    as: "matchedDocuments"
                }
            },
        ])
        const totalCount = await History.countDocuments(condition);
        return functions.success(res, 'Get list history success', { totalCount, listHistory })
    } catch (error) {
        return functions.setError(res, error.message);
    }
}


//-------------------------------------------------------controller quan ly blog -------------------------

exports.getListBlog = async (req, res, next) => {
    try {
        let { page, pageSize, title, blogId } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {};

        // dua dieu kien vao ob listCondition
        if (title) listCondition.title = new RegExp(title, 'i');
        if (blogId) listCondition._id = Number(blogId);
        let fieldsGet = {
            adminId: 1,
            langId: 1,
            title: 1,
            url: 1,
            image: 1,
            keyword: 1,
            sapo: 1,
            des: 1,
            detailDes: 1,
            date: 1,
            adminEdit: 1,
            dateLastEdit: 1,
            order: 1,
            active: 1,
            new: 1,
            hot: 1,
            titleRelate: 1,
            contentRelate: 1
        }

        let listBlog = await functions.pageFind(Blog, listCondition, { _id: 1 }, skip, limit);
        for (let i = 0; i < listBlog.length; i++) {
            let linkImage = `https://raonhanh365.vn/pictures/news/${listBlog[i].image}`;
            listBlog[i].linkImage = linkImage;
        }
        const totalCount = await functions.findCount(Blog, listCondition);
        return functions.success(res, "get list blog success", { totalCount: totalCount, data: listBlog });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.getAndCheckDataBlog = async (req, res, next) => {
    try {
        let image;
        if (req.files) {
            image = req.files.image;
        }
        if (!image) return functions.setError(res, `Missing input image`, 405);
        let { title, url, des, keyword, sapo, active, hot, detailDes, titleRelate, contentRelate, newStatus, date, dateLastEdit } = req.body;
        let fields = [title, url, image, des, keyword, sapo, detailDes, titleRelate, contentRelate];
        let adminId = req.infoAdmin._id;
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i])
                return functions.setError(res, `Missing input value ${i + 1}`, 404);
        }
        // them cac truong muon them hoac sua
        req.info = {
            adminId: adminId,
            title: title,
            url: url,
            image: image,
            des: des,
            keyword: keyword,
            sapo: sapo,
            active: active,
            hot: hot,
            new: newStatus,
            detailDes: detailDes,
            titleRelate: titleRelate,
            contentRelate: contentRelate,
            date: date,
            dateLastEdit: dateLastEdit
        }
        return next();
    } catch (error) {
        console.error(error)
        return functions.setError(res, error.message);
    }
}


//admin tạo 1 blog
exports.createBlog = async (req, res, next) => {
    try {
        let fields = req.info;
        let newIdBlog = await functions.getMaxIdByField(Blog, '_id');
        fields._id = newIdBlog;

        if (!fields.date) {
            fields.date = Date();
        }
        //luu anh
        let image = fields.image;
        if (!await functions.checkImage(image.path)) {
            return functions.setError(res, 'ảnh sai định dạng hoặc lớn hơn 2MB', 405);
        }
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let upload = await serviceRN.uploadFileRaoNhanh("news", `${year}/${month}/${day}`, image, ['.png', '.jpg', '.jpeg', '.gif', '.psd', '.pdf', '.jpg', '.docx', '.png']);
        fields.image = `${year}/${month}/${day}/` + upload;
        let blog = new Blog(fields);
        await blog.save();
        return functions.success(res, 'Create blog RN365 success!');
    } catch (error) {
        console.error(error)
        return functions.setError(res, error.message);
    }
}

exports.updateBlog = async (req, res, next) => {
    try {
        let _id = req.body._id;
        if (!_id) return functions.setError(res, "Missing input value id blog!", 404);
        let fields = req.info;
        if (!fields.dateLastEdit) {
            fields.dateLastEdit = Date(Date.now());
        }
        let image = fields.image;
        if (!await functions.checkImage(image.path)) {
            return functions.setError(res, 'ảnh sai định dạng hoặc lớn hơn 2MB', 405);
        }
        let existsBlog = await Blog.findOne({ _id: _id });
        if (existsBlog) {
            let upload = await serviceRN.uploadFileRaoNhanh("news", `${year}/${month}/${day}`, image, ['.png', '.jpg', '.jpeg', '.gif', '.psd', '.pdf', '.jpg', '.docx', '.png']);
            fields.image = `${year}/${month}/${day}/` + upload;
            //cap nhat du lieu
            await Blog.findOneAndUpdate({ _id: _id }, fields);
            return functions.success(res, "Blog edited successfully");
        }

        return functions.setError(res, "Blog not found!", 505);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//--------Duyet tin
//lay ra danh sach
exports.danhSachTinCanDuyet = async (req, res, next) => {
    try {
        let { page, pageSize, _id, title, updateTime, fromDate, toDate } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 30;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let condition = {};
        if (_id) condition._id = Number(_id);
        if (title) condition.title = new RegExp(title, 'i');
        if (updateTime) condition.updateTime = new Date(updateTime);
        if (fromDate && !toDate) condition.updateTime = { $gte: new Date(fromDate) };
        if (toDate && !fromDate) condition.updateTime = { $lte: new Date(toDate) };
        if (toDate && fromDate) condition.updateTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };

        let fields = { _id: 1, title: 1, linkTitle: 1, kiem_duyet: 1, createTime: 1, updateTime: 1 };
        let total = await functions.findCount(News, { kiem_duyet: 0 });
        let listNews = await functions.pageFindWithFields(News, { kiem_duyet: 0 }, fields, { _id: -1 }, skip, limit);
        return functions.success(res, "Get danh sach tin can duyet thanh cong", { total, data: listNews });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//duyet tin
exports.duyetTin = async (req, res, next) => {
    try {
        let _id = req.body._id;
        if (_id) {
            let activeNews = await News.findOneAndUpdate({ _id: _id }, { kiem_duyet: 1 }, { new: true });
            if (activeNews) {
                return functions.success(res, "Duyet tin thanh cong!");
            }
            return functions.setError(res, "Tin khong ton tai!", 406);
        }
        return functions.setError(res, "Missing input _id!", 405);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}
//---------Bao cao tin
// tạo mới
exports.createReport = async (req, res, next) => {
    try {
        const reportNewsData = req.body;
        const newReportNews = new ReportNews(reportNewsData);
        const savedReportNews = await newReportNews.save();
        res.status(201).json(savedReportNews);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}
// api danh sách tìm kiếm tin báo cáo
exports.listReportNew = async (req, res, next) => {
    try {
        let condition = {};
        let id_user = req.body.id_user;
        let userName = req.body.userName;
        let problem = req.body.problem;
        let thoiGianTu = req.body.thoiGianTu;
        let thoiGianDen = req.body.thoiGianDen;
        let page = req.body.page || 1;
        let pageSize = req.body.pageSize || 30;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        if (id_user) condition.id_user = id_user;
        if (thoiGianTu) condition.time = { $gte: new Date(thoiGianTu) }
        if (thoiGianDen) condition.time = { $lte: new Date(thoiGianDen) }
        if (thoiGianTu && thoiGianDen) condition.time = { $gte: new Date(thoiGianTu), $lte: new Date(thoiGianDen) }
        if (userName) condition['user.userName'] = userName;
        if (problem) condition.problem = problem;

        let data = await NewReport.aggregate([{
            $lookup: {
                from: 'Users',
                localField: 'id_user',
                foreignField: 'idRaoNhanh365',
                as: 'user'
            }
        }, {
            $match: condition
        }, {
            $skip: skip
        }, {
            $limit: limit
        }])
        return functions.success(res, "get list report success", { data });
    } catch (error) {
        return functions.setError(res, error.message)
    }
}
// api sửa tin báo cáo
exports.fixNewReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const Report = await ReportNews.findOneAndUpdate({ _id: id }, { fixed: 1 }, {
            new: true
        })
        return functions.success(res, "Fix report success", { data: Report });
    } catch (error) {
        return functions.setError(res, error.message)
    }
}


//-------------------------------------------------------controller giá ghim/day tin đăng -------------------------
//api tạo mới ghim tin đăng
exports.createAndUpdatePriceListPin = async (req, res, next) => {
    try {
        let { _id, time, unitPrice, discount, intoMoney, vat, intoMoneyVat, type, cardGift } = req.body;
        if ([1, 5, 3, 4].includes(Number(type)) && time && unitPrice && intoMoney && intoMoneyVat && cardGift) {
            let fields = {
                time: time,
                unitPrice: unitPrice,
                discount: discount,
                intoMoney: intoMoney,
                vat: vat,
                intoMoneyVat: intoMoneyVat,
                type: type,
                cardGift: cardGift
            }
            if (!_id) {
                _id = await functions.getMaxIdByField(PriceList, '_id');
                fields._id = _id;
            }
            let priceList = await PriceList.findOneAndUpdate({ _id: _id }, fields, { new: true, upsert: true }).lean();
            if (priceList) {
                return functions.success(res, "Create or Update success", { priceList });
            }
            return functions.setError(res, "Update fail!", 406);
        }
        return functions.setError(res, "Missing input or type invalid!", 405);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//api tạo mới ghim day tin
exports.updatePriceListPush = async (req, res, next) => {
    try {
        let { _id, time, unitPrice, discount, intoMoney, vat, intoMoneyVat, cardGift } = req.body;
        if (_id && time && unitPrice && intoMoney && intoMoneyVat && cardGift) {
            let fields = {
                time: time,
                unitPrice: unitPrice,
                discount: discount,
                intoMoney: intoMoney,
                vat: vat,
                intoMoneyVat: intoMoneyVat,
                cardGift: cardGift
            }
            let priceList = await PriceList.findOneAndUpdate({ _id: _id, type: 2 }, fields, { new: true });
            if (priceList) {
                return functions.success(res, "Update success", { priceList });
            }
            return functions.setError(res, "Price list not found!", 406);
        }
        return functions.setError(res, "Missing input value!", 405);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// api danh sách và tìm kiếm đẩy/ghim tin đăng 
exports.getListPrice = async (req, res, next) => {
    try {
        let { page, pageSize, type, _id, time } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 30;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        if (type == 1 || type == 2) {
            let condition = {};
            if (_id) condition._id = Number(_id);
            if (time) condition.time = new RegExp(time, 'i');

            //gia ghim tin
            if (type == 1) condition.type = { $in: [1, 3, 4, 5] };
            //gia day tin
            if (type == 2) condition.type = 2;
            let total = await functions.findCount(PriceList, condition);
            let priceList = await functions.pageFind(PriceList, condition, { _id: 1 }, skip, limit);
            return functions.success(res, "Lay ra danh sach gia day va ghim tin thanh cong", { total, data: priceList });
        }
        return functions.setError(res, "Truyen type=1, 2", 405);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//-------------------------------------------------------API chiet khau nap the-------------------------

// api tìm kiếm và danh sách chiết khấu
exports.getListDiscountCard = async (req, res, next) => {
    try {
        let { page, pageSize, _id, operator } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 30;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        let conditions = { active: 1 };
        if (_id) conditions._id = Number(_id);
        if (operator) conditions.operator = new RegExp(operator, 'i');

        let count = await functions.findCount(NetworkOperator, conditions);
        let data = await NetworkOperator.find(conditions).sort({ _id: 1 }).skip(skip).limit(limit);
        return functions.success(res, "Get List Discount Card Success", { count, data });
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

//chinh sua chiet khau
exports.updateDiscountCard = async (req, res, next) => {
    try {
        let { _id, operator, operatorName, discount } = req.body;
        if (_id && operator && operatorName && discount) {
            let updateDiscount = await NetworkOperator.findOneAndUpdate({ _id: _id }, {
                operator: operator,
                operatorName: operatorName,
                discount: discount
            }, { new: true });
            if (updateDiscount) {
                return functions.success(res, "Update Discount Success", { data: updateDiscount });
            }
            return funcitons.setError(res, "NetworkOperator not found!", 406);
        }
        return functions.setError(res, "Missing input value!", 405);
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.failRegisterUser = async (req, res, next) => {
    try {
        let page = req.body.page;
        let pageSize = req.body.pageSize;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let id = req.body.id;
        let thoiGianTu = req.body.thoiGianTu;
        let thoiGianDen = req.body.thoiGianDen;
        let condition = {};
        if (id) condition._id = id;
        if (thoiGianTu) condition.time = { $gte: new Date(thoiGianTu) }
        if (thoiGianDen) condition.time = { $lte: new Date(thoiGianDen) }
        if (thoiGianTu && thoiGianDen) condition.time = { $gte: new Date(thoiGianTu), $lte: new Date(thoiGianDen) }
        let count = await RegisterFail.find(condition, {}).count();
        let data = await RegisterFail.find(condition, {}).skip(skip).limit(limit)
        return functions.success(res, "get data success", { count, data })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.getInfoForEdit = async (req, res, next) => {
    try {
        let model = req.body.model;
        let _id = req.body._id;
        let data = {};
        switch (model) {
            case 'Users':
                data = await Users.findById({ _id })
                break;

            case 'New':
                data = await functions.getDatafind(New, { _id })
                break;
            case 'Order':
                data = await Order.findById({ _id });
        }
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//----------------------- xac thuc thanh toan

exports.getListUserVerifyPayment = async (req, res, next) => {
    try {
        let { page, pageSize, fromDate, toDate } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 50;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;

        if (fromDate && !toDate) condition["inforRN365.time"] = { $gte: new Date(fromDate) };
        if (toDate && !fromDate) condition["inforRN365.time"] = { $lte: new Date(toDate) };
        if (toDate && fromDate) condition["inforRN365.time"] = { $gte: new Date(fromDate), $lte: new Date(toDate) };

        let condition = { 'inforRN365.xacThucLienket': { $in: [1, 2] } };
        let total = await functions.findCount(Users, condition);
        let data = await functions.pageFind(Users, condition, { idRaoNhanh365: 1 }, skip, pageSize);
        return functions.success(res, "get list user verify paymet success", { total, data });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.adminVerifyPayment = async (req, res, next) => {
    try {
        // xacThucLienket: 2 => da xac thuc, 1: cho admin xac thuc
        let { userId, active, xacThucLienket } = req.body;
        if (!userId || !active || !xacThucLienket) {
            return functions.setError(res, "Missing input value!", 404);
        }
        let user = await Users.findOne({ _id: userId }, { userName: 1 });
        if (!user)
            return functions.setError(res, "Users not fount!", 404);
        if (xacThucLienket == 2) {
            await Users.findOneAndUpdate({ _id: userId }, {
                inforRN365: {
                    xacThucLienket: xacThucLienket,
                    active: active
                }
            }, { new: true })
            return functions.success(res, 'admin verify payment success!');
        }
        await Users.findOneAndUpdate({ _id: userId }, {
            inforRN365: {
                cccd: null,
                cccdFrontImg: null,
                cccdBackImg: null,
                bankName: null,
                stk: null,
                ownerName: null,
                time: null,
                active: 0,
                xacThucLienket: 1
            }
        })
        return functions.success(res, 'admin delete verify payment success!');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//-----------------------nguoi mua xac thuc thanh toan

exports.getListOrderPayment = async (req, res, next) => {
    try {
        let page = req.body.page || 1;
        let pageSize = req.body.pageSize || 50;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let _id = req.body.id;
        let thoiGianTu = req.body.thoiGianTu;
        let thoiGianDen = req.body.thoiGianDen;
        let conditions = {};
        if (_id) conditions._id = _id;
        if (thoiGianDen) conditions.thoiGianDen = { $lte: { thoiGianDen } };
        if (thoiGianTu) conditions.thoiGianTu = { $gte: { thoiGianTu } };
        let count = await Order.aggregate([
            {
                $match: conditions
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'buyerId',
                    foreignField: 'idRaoNhanh365',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'RN365_News',
                    localField: 'newId',
                    foreignField: '_id',
                    as: 'new'
                }
            },
            {
                $count: "all"
            }
        ]);
        await Order.createIndexes({ buyerId: 1, newId: 1 });

        let data = await Order.aggregate([
            {
                $match: conditions
            },
            { $sort: { _id: 1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'buyerId',
                    foreignField: 'idRaoNhanh365',
                    as: 'Buyer'
                }
            }, {
                $lookup: {
                    from: 'RN365_News',
                    localField: 'newId',
                    foreignField: '_id',
                    as: 'New'
                }
            },
            {
                $project: {
                    "_id": "$_id",
                    "buyerId": "$buyerId",
                    "sellerId": "$sellerId",
                    "newId": "$newId",
                    "paymentType": "$paymentType",
                    "buyTime": "$buyTime",
                    "orderActive": "$orderActive",
                    "amountPaid": "$amountPaid",
                    "buyerName": "$Buyer.userName",
                    "newsTitle": "$New.title",
                }
            },
        ]);

        return functions.success(res, "get list user verify paymet success", { count, data });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.adminVerifyOrder = async (req, res, next) => {
    try {
        let { orderId, active } = req.body;
        if (!orderId || !active) {
            return functions.setError(res, "Missing input value!", 404);
        }
        let order = await Order.findOne({ _id: orderId });
        if (!order)
            return functions.setError(res, "Order not fount!", 404);
        await Order.findOneAndUpdate({ _id: orderId }, { orderActive: active })
        return functions.success(res, 'admin verify payment success!');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.active = async (req, res, next) => {

}

//tag index
exports.getListTagsIndex = async (req, res, next) => {
    try {
        let { page, pageSize, type, _id, fromDate, toDate } = req.body;
        if (!page) page = 1;
        if (!pageSize) pageSize = 30;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        if (type == 1 || type == 2 || type == 3 || type == 4 || type == 5 || type == 6) {
            let listCondition = {};
            //danh sach danh muc va tag
            if (type == 1) listCondition.classify = { $in: [1, 2] };

            //danh sach dia diem
            if (type == 2) listCondition.classify = { $in: [3, 14] };

            //danh sach tag + dia diem
            if (type == 3) listCondition.classify = { $in: [4, 9, 15] };

            //danh sach nganh nghe + tag nganh nghe
            if (type == 4) listCondition.classify = { $in: [5, 6] };

            //danh sach viec lam + dia diem
            if (type == 5) listCondition.classify = { $in: [10, 11] };

            //danh sach nganh nghe + tag nganh nghe
            if (type == 6) listCondition.classify = { $in: [12, 13] };
            if (fromDate && !toDate && functions.checkDate(fromDate)) {
                listCondition.time = { $gte: functions.convertTimestamp(fromDate) };
            }
            if (!fromDate && toDate && functions.checkDate(toDate)) {
                listCondition.time = { $lte: functions.convertTimestamp(toDate) };
            }
            if (fromDate && toDate && functions.checkDate(fromDate) && functions.checkDate(toDate)) {
                listCondition.time = { $gte: functions.convertTimestamp(fromDate), $lte: functions.convertTimestamp(toDate) };
            }

            if (_id) listCondition._id = Number(_id);
            let fieldsGet = { _id: 1, link: 1, cateId: 1, tags: 1, time: 1 }
            const listTagsIndex = await functions.pageFindWithFields(TagIndex, listCondition, fieldsGet, { _id: -1 }, skip, limit);
            const totalCount = await functions.findCount(TagIndex, listCondition);
            return functions.success(res, "get list tags index success", { totalCount: totalCount, data: listTagsIndex });
        }
        return functions.setError(res, "type = 1, 2, 3, 4, 5, 6", 405);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.deleleManyByModule = async (req, res, next) => {
    try {
        let moduleId = req.body.moduleId;
        let arrId = req.body.arrId;
        if (moduleId && arrId && arrId.length > 0) {
            let arrIdDelete = arrId.map(idItem => parseInt(idItem));
            //tag index
            if (moduleId == 36) {
                await TagIndex.deleteMany({ _id: { $in: arrIdDelete } });
                return functions.success(res, 'xóa thành công!');
            }
            //chiet khau nap tien
            if (moduleId == 39) {
                await NetworkOperator.deleteMany({ _id: { $in: arrIdDelete } });
                return functions.success(res, 'xóa thành công!');
            }
            //gia ghim day tin
            if (moduleId == 32 || moduleId == 33) {
                await PriceList.deleteMany({ _id: { $in: arrIdDelete } });
                return functions.success(res, 'xóa thành công!');
            }
            if (moduleId == 14 || moduleId == 28 || moduleId == 29 || moduleId == 30) {
                await News.deleteMany({ _id: { $in: arrIdDelete } });
                return functions.success(res, 'xóa thành công!');
            }
            if (moduleId == 26 || moduleId == 23) {
                await Users.deleteMany({ idRaoNhanh365: { $in: arrIdDelete } });
                return functions.success(res, 'xóa thành công!');
            }
            return functions.setError(res, "Truyen dung moduleId muon xoa", 406);
        }
        return functions.setError(res, "Truyen moduleId va arrId dang mang", 405);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}