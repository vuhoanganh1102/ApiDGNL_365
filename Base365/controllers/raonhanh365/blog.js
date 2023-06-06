const functions = require('../../services/functions')
const Blog = require('../../models/Raonhanh365/Admin/Blog')
const AdminUser = require('../../models/Raonhanh365/Admin/AdminUser');
const Category = require('../../models/Raonhanh365/Category');
const md5 = require('md5');

exports.getListBlogByFields = async(req, res, next) => {
    try {
        if (req.body) {
            if(!req.body.page){
                return functions.setError(res, "Missing input page", 401);
            }
            if(!req.body.pageSize){
                return functions.setError(res, "Missing input pageSize", 402);
            }
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let idBlog = req.body.idBlog;
            let cateID = req.body.cateID;
            let adminID = req.body.adminID;
            let title = req.body.title;
            let des = req.body.des;
            let listCondition = {};

            // dua dieu kien vao ob listCondition
            if(idBlog) listCondition._id = idBlog;
            if(cateID) listCondition.categoryId =  Number(cateID);
            if(adminID) listCondition.adminId =  Number(adminID);
            if(title) listCondition.title =  new RegExp(title);
            if(des) listCondition.des =  new RegExp(des);
            let fieldsGet = 
            {   
                adminId: 1, langId: 1,title: 1,url: 1,titleRewrite: 1,image: 1,imageWeb: 1,teaser: 1,keyword: 1,sapo: 1,des: 1,
                categoryId: 1,status: 1,date: 1,adminEdit: 1,dateLastEdit: 1,order: 1,totalVoteYes: 1,totalVoteNo: 1,hit: 1,active: 1, new: 1, titleRelate: 1, contentRelate: 1
            }
            const listBlog = await functions.pageFindWithFields(Blog, listCondition, fieldsGet, { _id: 1 }, skip, limit); 
            const totalCount = await functions.findCount(Blog, listCondition);
            return functions.success(res, "get list blog success", {totalCount: totalCount, data: listBlog });
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.getAndCheckData = async(req, res, next) => {
    try {
        let image = req.files.image;
        let imageWeb = req.files.imageWeb;
        let {adminId,title,url,titleRewrite,des,categoryId,status,keyword, sapo, active, hot, detailDes , titleRelate, contentRelate, newStatus} = req.body;
        let fields = [adminId, title, url, image, imageWeb, des,keyword,  sapo, detailDes, titleRelate, contentRelate];
        for(let i=0; i<fields.length; i++){
            if(!fields[i])
                return functions.setError(res, `Missing input value ${i+1}`, 404);
        }
        if(!await functions.checkImage(image.path)) {
            await functions.deleteImgVideo(image)
            return functions.setError(res, 'ảnh sai định dạng hoặc lớn hơn 2MB', 405)
        }
        if(!await functions.checkImage(imageWeb.path)) {
            await functions.deleteImgVideo(imageWeb)
            return functions.setError(res, 'ảnh sai định dạng hoặc lớn hơn 2MB', 406)
        }
        let imgName = image.originalFilename;
        let imgWebName = imageWeb.originalFilename;
        // them cac truong muon them hoac sua
        req.info = {
            adminId: adminId,
            title: title,
            url: url,
            image: imgName,
            imageWeb: imgWebName,
            des: des,
            status: status,
            keyword: keyword,
            sapo: sapo,
            active: active,
            hot: hot,
            new: newStatus,
            detailDes: detailDes,
            titleRelate: titleRelate,
            contentRelate: contentRelate
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}


//admin tạo 1 blog
exports.createBlog = async(req, res, next) => {
    try {
        let fields = req.info;
        const maxIdBlog = await Blog.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIdBlog;
        if (maxIdBlog) {
            newIdBlog = Number(maxIdBlog._id) + 1;
        } else newIdBlog = 1;
        fields._id = newIdBlog;
        fields.date = Date(Date.now());
        let blog = new Blog(fields);
        await blog.save();
        return functions.success(res, 'Create blog RN365 success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateBlog = async(req, res, next) => {
    try{
        if(!req.body._id)
            return functions.setError(res, "Missing input value id blog!", 404);
        let _id = req.body._id;
        let fields = req.info;
        fields.dateLastEdit = Date(Date.now());
        let existsBlog = await Blog.findOne({_id: _id});
        if (existsBlog) {
            await Blog.findByIdAndUpdate(_id, fields);
            return functions.success(res, "Blog edited successfully");
        }
        return functions.setError(res, "Blog not found!", 505);
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.deleteBlog = async(req, res, next) => {
    try {
        let idBlog = Number(req.query.idBlog);
        let adminId = Number(req.query.adminId);
        if (idBlog) {
            let blog = await functions.getDataDeleteOne(Blog ,{_id: idBlog});
            if (blog.deletedCount===1) {
                return functions.success(res, `Delete blog with _id=${idBlog} success`);
            }else{
                return functions.success(res, "Blog not found");
            }
        } 
        if(adminId){
            if (!await functions.getMaxID(Blog)) {
                functions.setError(res, "No blog existed", 513);
            } else {
                Blog.deleteMany({adminId: adminId})
                    .then(() => functions.success(res, "Delete all blog by adminId successfully"))
                    .catch(err => functions.setError(res, err.message, 514));
            }
        }
        if(!await functions.getMaxID(Blog)) {
                functions.setError(res, "No blog existed", 513);
        } else {
            Blog.deleteMany()
                .then(() => functions.success(res, "Delete all blog successfully"))
                .catch(err => functions.setError(res, err.message, 514));
        }
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}
exports.createToken = async(req, res, next) => {
    try{
        let admin = await AdminUser.findOne({_id: 1});
        let token = await functions.createToken(admin, "28d")
        res.setHeader('authorization', `Bearer ${token}`);
        return functions.success(res, 'Create token admin success', );
    }catch(error){
        console.log("Đã có lỗi xảy ra tao token", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.createAdmin = async(req, res, next) => {
    try{
        let request = req.body;
        let loginName = request.loginName,
            password = request.password,
            name = request.name,
            email = request.email,
            address = request.address,
            phone = request.phone,
            mobile = request.mobile,
            accessModule = request.accessModule,
            accessCategory = request.accessCategory,
            date = request.date,
            isAdmin = request.isAdmin,
            active = request.active,
            langId = request.langId,
            allCategory = request.allCategory,
            editAll = request.editAll,
            department = request.department,
            empId = request.empId,
            employer = request.employer;
        const maxIDAdmin = await AdminUser.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIDAdmin;
        if (maxIDAdmin) {
            newIDAdmin = Number(maxIDAdmin._id) + 1;
        } else newIDAdmin = 1;
        let fields = {_id: newIDAdmin, loginName, password: md5(password), name: name, email: email, address: address, isAdmin: 1, active: 1}
        const admin = new AdminUser(fields);
        await admin.save();
        return functions.success(res, 'Create token admin success');
    }catch(error){
        console.log("Đã có lỗi xảy ra tao token", err);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}