const md5 = require('md5');

const AdminUser = require('../../models/AdminUser');
const Modules = require('../../models/Timviec365/Admin/Modules');
const functions = require('../../services/functions');
const AdminUserRight = require('../../models/Timviec365/Admin/AdminUserRight')
const CategoryJob = require('../../models/Timviec365/CategoryJob')
const CategoryBlog = require('../../models/Timviec365/Blog/Category')
const functionAdmin = require('../../services/timviec365/admin');
const Category = require('../../models/Timviec365/Blog/Category');

// hàm lấy dữ liệu modules
exports.getModules = async(req, res, next) => {
    try {
        let modules = await functions.getDatafind(Modules);
        if (modules) {
            return functions.success(res, 'lấy dữ liệu thành công', modules)
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};
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
                langID = request.langID;
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
                        return functions.success(res, 'thêm mới thành công', { token })
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

//hàm đăng nhập admin
exports.loginAdmin = async(req, res, next) => {
    try {
        if (req.body.username && req.body.password) {
            const username = await functions.replaceMQ(req.body.username);
            const password = await functions.replaceMQ(req.body.password);
            var findUser = await functions.getDatafindOne(AdminUser, { loginName: username, active: 1, delete: 0 });
            if (!findUser) {
                return functions.setError(res, "Không tồn tại tài khoản Admin", 200)
            }
            let checkPassword = await functions.verifyPassword(password, findUser.password)
            if (!checkPassword) {
                return functions.setError(res, "Mật khẩu sai", 200)
            }

            const token = await functions.createToken(findUser, "2d");
            return functions.success(res, 'Đăng nhập thành công', { token, adminId: findUser._id });
        }
    } catch (e) {
        return functions.setError(res, "Đã có lỗi xảy ra", 400)
    }

}

//thêm mới danh mục
exports.addCategory = async(req, res, next) => {
    try {
        if (req.user && req.body.cateName) {
            let cateName = req.body.cateName
            let parentId = req.body.parentId
            let findCate = await functions.getDatafindOne(CategoryJob, { name: cateName })
            if (findCate) {
                return functions.setError(res, "Danh mục đã tồn tại", 400)
            } else {
                const maxID = await CategoryJob.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                } else newID = 1
                let newCate = new CategoryJob({
                    _id: newID,
                    name: cateName
                })
                newCate.save()
                if (parentId) {
                    let updateCateMulti = await functions.getDatafindOneAndUpdate(CategoryBlog, { _id: parentId }, { hasChild: 1 })
                }
                return functions.success(res, 'Thêm danh mục thành công');

            }
        } else return functions.setError(res, "Tham số truyền lên không đầy đủ", 400)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

//hiển thị danh mục (còn thiếu luồng ẩn lấy danh mục con)
exports.listCategory = async(req, res, next) => {
    try {
        if (req.user) {
            let cate = await CategoryJob.find({ parentID: 0 }, { name: 1 })
            if (cate) {
                return functions.success(res, 'lấy dữ liệu thành công', { cate })
            }
        } else return functions.setError(res, "Bạn không phải là admin (chưa truyền lên token chứ j)", 400)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

//thêm mới danh mục blog
exports.addCategoryBlog = async(req, res, next) => {
    try {
        if (req.user && req.body.catName) {
            let cateName = req.body.catName
            let catLink = req.body.catLink
            let adminId = req.user.data._id
            let catTitle = req.body.catTitle
            let catKeyword = req.body.catKeyword
            let catDes = req.body.catDes
            let catOrder = req.body.catOrder
            let catNameRewrite = await functionAdmin.replaceTitle(catTitle)
            let findCate = await functions.getDatafindOne(CategoryBlog, { name: cateName })
            if (findCate) {
                return functions.setError(res, "Danh mục đã tồn tại", 400)
            } else {
                const maxID = await CategoryBlog.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                } else newID = 1
                let newCate = new CategoryBlog({
                    _id: newID,
                    name: cateName,
                    adminID: adminId,
                    title: catTitle,
                    keyword: catKeyword,
                    link: catLink,
                    description: catDes,
                    nameRewrite: catNameRewrite,

                })
                newCate.save()

                return functions.success(res, 'Thêm danh mục Blog thành công');

            }
        } else return functions.setError(res, "Tham số truyền lên không đầy đủ", 400)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

//hiển thị danh mục blog
exports.listCategoryBlog = async(req, res, next) => {
    try {
        if (req.user) {
            let cateId = req.body.cateId
            let tagName = req.body.tagName
            let query = {}
            if (cateId) {
                query._id = cateId
            }
            if (tagName) {
                let keyName1 = await functions.replaceMQ(tagName)
                let keyName2 = await functions.replaceKeywordSearch(1, keyName1)
                let keyName3 = new RegExp(keyName2.replace(/\s+/g, ".*"), "i");
                query.name = { $regex: keyName3 }
            }

            let cate = await CategoryBlog.find(query, { _id: 1, name: 1, active: 1, order: 1 })
            if (cate) {
                return functions.success(res, 'lấy dữ liệu thành công', { listCategoryBlog: cate, totalRecord: cate.length })
            }
        } else return functions.setError(res, "Bạn không phải là admin (chưa truyền lên token chứ j)", 400)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

//cập nhật danh mục blog
exports.updateCategoryBlog = async(req, res, next) => {
    try {
        if (req.user && req.body.catName && req.body.catId) {
            let adminId = req.user.data._id
            let cateId = req.body.catId
            let cateName = req.body.catName
            let catLink = req.body.catLink || ""
            let catTitle = req.body.catTitle || ""
            let catKeyword = req.body.catKeyword || ""
            let catDes = req.body.catDes || ""
            let catOrder = req.body.catOrder || 1
            let catNameRewrite
            if (catTitle != "") {
                catNameRewrite = await functionAdmin.replaceTitle(catTitle)
            }
            let updateCate = await CategoryBlog.findOneAndUpdate({ _id: cateId, adminID: adminId }, {
                $set: {
                    name: cateName,
                    title: catTitle,
                    keyword: catKeyword,
                    link: catLink,
                    description: catDes,
                    nameRewrite: catNameRewrite,
                    order: catOrder
                }
            }, { new: true });
            if (updateCate) {
                return functions.success(res, 'Cập nhật danh mục Blog thành công');
            } else return functions.setError(res, "Cập nhật thất bại", 400)

        } else return functions.setError(res, "Tham số truyền lên không đầy đủ", 400)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

//cập nhật trạng thái active của danh muc blog
exports.updateActiveCategoryBlog = async(req, res, next) => {
    try {
        if (req.user && req.body.cateId && req.body.cateName) {
            let adminId = req.user.data._id
            let cateId = req.body.cateId
            let cateName = req.body.cateName
            let active = Number(req.body.active)
            let updateCate
            if (active == 1) {
                updateCate = await CategoryBlog.findOneAndUpdate({ _id: cateId, adminID: adminId, name: cateName }, {
                    $set: {
                        active: 0
                    }
                }, { new: true });
            } else {
                updateCate = await CategoryBlog.findOneAndUpdate({ _id: cateId, adminID: adminId, name: cateName }, {
                    $set: {
                        active: 1
                    }
                }, { new: true });
            }
            if (updateCate) {
                return functions.success(res, 'Chỉnh sửa trạng thái active thành công thành công');
            } else return functions.setError(res, "Cập nhật thất bại", 400)

        } else return functions.setError(res, "Tham số truyền lên không đầy đủ", 400)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

exports.listCategoryBlog = async(req, res, next) => {
    try {
        if (req.user && req.body.listCateId) {
            let listArrCateId = req.body.listCateId.split(',')
            let listCateIdChild = []
            let findCate = await CategoryBlog.find({ parentID: { $in: listArrCateId } }, { _id: 1 })
            for (let i = 0; i < listArrCateId.length; i++) {
                if (listArrCateId.includes(findCate[i]._id)) {
                    listCateIdChild.push(findCate[i]._id)
                }
            }
            if (listCateIdChild != []) {
                return functions.setError(res, `Bạn cần xóa hết danh mục con trước : ${listCateIdChild}`, 400)
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};