const functions = require('../../services/functions')
const Blog = require('../../models/Raonhanh365/Admin/Blog')
const AdminUser = require('../../models/AdminUser')
const Category = require('../../models/Raonhanh365/Category')

// hàm lấy danh sách blog
exports.listBlog = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let blogs = await Blog.aggregate([{
                    $lookup: {
                        from: "AdminUser",
                        localField: "adminId",
                        foreignField: "_id",
                        as: "AdminUser"
                    }
                },
                {
                    $unwind: "$AdminUser"
                },
                {
                    $project: {
                        blog: "$$ROOT",
                        "adminUser.name": 1
                    }
                },
                { $sort: { _id: -1 } },
                { $count: "totalCount" },
                { $skip: skip },
                { $limit: limit }
            ]);
            console.log(blogs)
            const totalCount = blogs.length > 0 ? blogs[0].totalCount : 0;
            const totalPages = Math.ceil(totalCount / pageSize);
            if (blogs) {
                return functions.success(res, "Lấy danh sách blog thành công", { totalCount, totalPages, blogs: blogs });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let blogs = await Blog.aggregate([{
                    $lookup: {
                        from: "AdminUser",
                        localField: "adminID",
                        foreignField: "_id",
                        as: "AdminUser"
                    }
                },
                {
                    $unwind: "$adminUser"
                },
                {
                    $project: {
                        blog: "$$ROOT",
                        "adminUser.name": 1
                    }
                },
                { $sort: { _id: -1 } },

            ])
            return functions.success(res, "Lấy danh sách blog thành công không phân trang thành công", { blogs });

        }

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

//thông tin 1 blog
exports.getBlogDetail = async(req, res, next) => {
    try {
        let BlogId = req.body.BlogId;
        if (BlogId) {
            let blog = await functions.getDatafindOne(Blog, { _id: BlogId });
            if (blog) {
                return functions.success(res, "Lấy danh sách blog thành công", { blog });
            }
            return functions.setError(res, 'không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

//thông tin blog của tác giả
exports.getAuthorDetail = async(req, res, next) => {
    try {
        let adminId = req.body.adminId;
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        if (adminId && page && pageSize) {
            let admin = await functions.getDatafindOne(AdminUser, { _id: adminId });
            if (admin) {
                const skip = (page - 1) * pageSize;
                const limit = pageSize;
                const blogs = await functions.pageFind(Blog, { adminId: adminId }, { _id: -1 }, skip, limit);
                const totalCount = await functions.findCount(Blog, { adminId: adminId });
                console.log(totalCount)
                const totalPages = Math.ceil(totalCount / pageSize);
                return functions.success(res, "Lấy danh sách blog thành công", { admin: admin, totalCount: totalCount, totalPages: totalPages, blogs: blogs });
            }
            return functions.setError(res, 'không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy ra danh sách danh mục 
exports.getListCategoryBlog = async(req, res, next) => {
    try {
        let categories = await functions.getDatafind(Category)
        return functions.success(res, "Lấy danh sách blog thành công", { categories });
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy ra danh sách blog của 1 danh mục  của blog
exports.getCategoryBlog = async(req, res, next) => {
    try {
        let cateId = req.body.cateId;
        if (cateId) {
            let categories = await functions.getDatafind(Blog, { categoryId: cateId })
            return functions.success(res, "Lấy danh sách blog thành công", { categories });
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

//admin tạo 1 blog
exports.CreateBlog = async(req, res, next) => {
    try {
        if (req.user) {


        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}