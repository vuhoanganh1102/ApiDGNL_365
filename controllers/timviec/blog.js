const functions = require('../../services/functions')
const Blog = require('../../models/Timviec365/Timviec/Blog/Blog.model')
const AdminUser = require('../../models/Timviec365/Timviec/Admin/AdminUser.model')
const CategoryBlog = require('../../models/Timviec365/Timviec/Blog/category')

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
                        localField: "adminID",
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

exports.getBlogDetail = async(req, res, next) => {
    try {
        let idBlog = req.body.blog_id;
        if (idBlog) {
            let blog = await functions.getDatafindOne(Blog, { _id: idBlog });
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

exports.getAuthorDetail = async(req, res, next) => {
    try {
        let idAdmin = req.body.admin_id;
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        if (idAdmin && page && pageSize) {
            let admin = await functions.getDatafindOne(AdminUser, { _id: idAdmin });
            if (admin) {
                const skip = (page - 1) * pageSize;
                const limit = pageSize;
                const blogs = await functions.pageFind(Blog, { adminID: idAdmin }, { _id: -1 }, skip, limit);
                const totalCount = await functions.findCount(Blog, { adminID: idAdmin });
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
        let categories = await functions.getDatafind(CategoryBlog)
        return functions.success(res, "Lấy danh sách blog thành công", { categories });
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy ra danh sách danh mục  của blog
exports.getCategoryBlog = async(req, res, next) => {
    try {
        let cateID = req.body.cate_id;
        if (cateID) {
            let categories = await functions.getDatafind(Blog, { categoryID: cateID })
            return functions.success(res, "Lấy danh sách blog thành công", { categories });
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}