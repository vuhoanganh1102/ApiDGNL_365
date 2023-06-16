const functions = require('../../services/functions');
const AdminUser = require('../../models/Raonhanh365/Admin/AdminUser');
const Category = require('../../models/Raonhanh365/Category');
const News = require('../../models/Raonhanh365/UserOnSite/New');
const PriceList = require('../../models/Raonhanh365/PriceList');
const Users = require('../../models/Users');
const History = require('../../models/Raonhanh365/History');
const Blog = require('../../models/Raonhanh365/Admin/Blog');
const ReportNews = require('../../models/Raonhanh365/UserOnSite/NewReport');
const NetworkOperator = require('../../models/Raonhanh365/NetworkOperator')
const AdminUserRight = require('../../models/Raonhanh365/Admin/AdminUserRight');

const serviceRN = require('../../services/rao nhanh/raoNhanh');
const folderImg = "img_blog";
const md5 = require('md5');
const Cart = require("../../models/Raonhanh365/Cart");

//đăng nhập admin
exports.loginAdminUser = async(req, res, next) => {
    try {
        if (req.body.loginName && req.body.password) {
            const loginName = req.body.loginName
            const password = req.body.password
            let findUser = await functions.getDatafindOne(AdminUser, { loginName })
            if (!findUser) {
                return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 200)
            }
            let checkPassword = await functions.verifyPassword(password, findUser.password)
            if (!checkPassword) {
                return functions.setError(res, "Mật khẩu sai", 200)
            }
            let updateUser = await functions.getDatafindOneAndUpdate(Users, { loginName }, {
                date: new Date(Date.now())
            })
            const token = await functions.createToken(findUser, "2d")
            return functions.success(res, 'Đăng nhập thành công', { token: token })

        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }

}

exports.getListAdminUser = async(req, res, next)=>{
    try{
        //lay cac tham so dieu kien tim kiem tin
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
        let idAdmin = req.body.idAdmin;
        let condition = {};
        if(idAdmin) condition._id = Number(idAdmin);
        let fields = {loginName: 1, name: 1, email: 1, phone: 1, editAll:1, langId:1, active: 1};
        let listAdminUser = await functions.pageFindWithFields(AdminUser, condition, fields, { _id: 1 }, skip, limit); 
        
        // lap qua danh sach user
        for(let i=0; i<listAdminUser.length; i++){
            let adminUserRight = await AdminUserRight.find({adminId: listAdminUser[i]._id});
            let arrIdModule = [],
                arrRightAdd = [],
                arrRightEdit = [],
                arrRightDelete = []
            // lap qua cac quyen cua admindo
            for(let j=0; j<adminUserRight.length; j++){
                arrIdModule.push(adminUserRight[j].moduleId);
                arrRightAdd.push(adminUserRight[j].add);
                arrRightEdit.push(adminUserRight[j].edit);
                arrRightDelete.push(adminUserRight[j].delete);
            }
            let adminUser = listAdminUser[i];
            let tmpOb = {adminUser, arrIdModule, arrRightAdd,arrRightEdit,arrRightDelete};
            listAdminUser[i] = tmpOb;
        }
        const totalCount = await functions.findCount(AdminUser, condition);
        return functions.success(res, "get list blog success", {totalCount: totalCount, data: listAdminUser });
    }catch(error){
        console.log(error)
        return functions.setError(res, error)
    }
}


exports.getAndCheckDataAdminUser = async(req, res, next) => {
    try {
        let {loginName, name, phone, email, editAll, langId, active, accessModule, adminId} = req.body;
        if(!loginName || !phone || !phone) {
            return functions.setError(res, "Missing input value", 404)
        }

        // xoa cac quyen hien tai cua admin neu chon muc sua
        if(adminId){
            let adminUserRight =  await AdminUserRight.deleteMany({adminId: adminId});
        }else {
            const maxIdAdminUser = await AdminUser.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
            if (maxIdAdminUser) {
                adminId = Number(maxIdAdminUser._id) + 1;
            } else adminId = 1;
            
        }
        //cap quyen cho admin ca them moi+sua
        let {arrIdModule, arrRightAdd, arrRightEdit, arrRightDelete} = req.body;
        arrIdModule = arrIdModule.split(",");
        arrRightAdd = arrRightAdd.split(",");
        arrRightEdit = arrRightEdit.split(",");
        arrRightDelete = arrRightDelete.split(",");
        
        //
        for(let i=0; i<arrIdModule.length; i++){
            //tao id cho bang phan quyen
            const maxIdAdminUserRight = await AdminUserRight.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
            let newIdAdminUserRight;
            if (maxIdAdminUserRight) {
                newIdAdminUserRight = Number(maxIdAdminUserRight._id) + 1;
            } else newIdAdminUserRight = 1;
            
            let fieldsRight = {
                _id: newIdAdminUserRight,
                adminId: adminId,
                moduleId: arrIdModule[i],
                add: arrRightAdd[i],
                edit: arrRightEdit[i],
                deletelet: arrRightDelete[i]
            }
            
            let adminUserRight = new AdminUserRight(fieldsRight);
            await adminUserRight.save();
        }
        
        // them cac truong muon them hoac sua
        req.info = {
            _id: adminId,
            loginName: loginName,
            name: name,
            phone: phone,
            email: email,
            langId: langId,
            editAll: editAll,
            active: active,
            accessModule: accessModule,
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createAdminUser = async(req, res, next) => {
    try{
        // luu thong tin admin
        let fields = req.info;

        let adminUser = new AdminUser(fields);
        await adminUser.save();
        return functions.success(res, 'Create AdminUser and AdminUserRight RN365 success!');
    }catch(e){
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateAdminUser = async(req, res, next) => {
    try{
        if(!req.body.adminId)
            return functions.setError(res, "Missing input value id admin!", 404);
        let adminId = req.body.adminId;
        let fields = req.info;
        delete fields._id;
        let existsAdminUser = await AdminUser.findOne({_id: adminId});
        if (existsAdminUser) {
            
            await AdminUser.findOneAndUpdate({_id: adminId}, fields);
            return functions.success(res, "AdminUser edited successfully");
        }
        return functions.setError(res, "AdminUser not found!", 505);
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.deleteAdminUser = async(req, res, next) => {
    try {
        let userID = Number(req.query.userID);
        if (userID) {
            let user = await functions.getDataDeleteOne(Users ,{_id: userID});
            if (user.deletedCount===1) {
                return functions.success(res, `Delete user with _id=${userID} success`);
            }else{
                return functions.success(res, "User not found");
            }
        }
        return functions.setError(res, "Missing input userID", 500);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//-----------------------------------------------------------controller quan ly danh muc----------------------------------------------------------------

// lay ra danh sach
exports.getListCategory = async(req, res, next)=>{
    try{
        let request = req.body;
        let _id = request._id,
            name = request.name

        let condition = {};
        if(_id) condition._id = Number(_id);
        if(name) condition.name = new RegExp(name);
        let listCategory = await Category.find(condition);
        return functions.success(res, 'Get list category success', { data: listCategory })
    }catch(error){
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.getAndCheckDataCategory = async(req, res, next) => {
    try {
        let {parentId,adminId ,name,order, description} = req.body;
        if(!name || !order) {
            return functions.setError(res, "Missing input value", 404)
        }
        // them cac truong muon them hoac sua
        req.info = {
            parentId: parentId,
            adminId: adminId,
            name: name,
            order: order,
            description: description
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createCategory = async(req, res, next) => {
    try{
        let fields = req.info;
        const maxIdCategory = await Category.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIdCategory;
        if (maxIdCategory) {
            newIdCategory = Number(maxIdCategory._id) + 1;
        } else newIdCategory = 1;
        fields._id = newIdCategory;
        let category = new Category(fields);
        await category.save();
        return functions.success(res, 'Create category RN365 success!');
    }catch(e){
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateCategory = async(req, res, next) => {
    try{
        if(!req.body.cateID)
            return functions.setError(res, "Missing input value id cate!", 404);
        let cateID = req.body.cateID;
        let fields = req.info;

        let existsCategory = await Category.findOne({_id: cateID});
        if (existsCategory) {

            await Category.findOneAndUpdate({_id: cateID}, fields);
            return functions.success(res, "Category edited successfully");
        }
        return functions.setError(res, "Category not found!", 505);
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}


//---------------------------------------------------------controller quan ly tin(tin rao vat, tin mua)-----------------------------------------------
//-------gom ca quan ly tin tuyen dung va tin tim viec lam -----> bang cach su dung truong cateID de phan biet

//api lay ra danh sach va tim kiem tin
// khi truyen cateID = 120, 121 se lay dc tin tuyen dung va tin tim viec lam
exports.getListNews = async(req, res, next)=>{
    try{
        //lay cac tham so dieu kien tim kiem tin
        let request = req.body;
        let buySell = request.buySell,
            _id = request._id,
            title = request.title
        cateID = request.cateID

        let condition = {};
        if(buySell) condition.buySell = Number(buySell);// 1: tin mua, 2: tin ban
        if(_id) condition._id = Number(_id);
        if(title) condition.title = new RegExp(title);
        if(cateID) condition.cateID = Number(cateID);// cate
        let fields = {image: 1, _id: 1, title: 1, cateID: 1, createTime: 1, active: 1, city: 1};

        let listNews = await News.find(condition, fields);
        return functions.success(res, 'Get list news success', { data: listNews })
    }catch(error){
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.getAndCheckDataNews = async(req, res, next) => {
    try {
        let {title, description} = req.body;
        if(!title || !description) {
            return functions.setError(res, "Missing input value", 404)
        }
        // them cac truong muon them hoac sua
        req.info = {
            title: title,
            description: description
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createNews = async(req, res, next) => {
    try{
        let fields = req.info;
        const maxIdNews = await News.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIdNews;
        if (maxIdNews) {
            newIdNews = Number(maxIdNews._id) + 1;
        } else newIdNews = 1;
        fields._id = newIdNews;
        fields.createTime = Date(Date.now());
        let news = new News(fields);
        await news.save();
        return functions.success(res, 'Create news RN365 success!');
    }catch(e){
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateNews = async(req, res, next) => {
    try{
        if(!req.body.newsID)
            return functions.setError(res, "Missing input value id news!", 404);
        let newsID = req.body.newsID;
        let fields = req.info;
        fields.updateTime = Date(Date.now());
        let existsNews = await News.findOne({_id: newsID});
        if (existsNews) {
            await News.findOneAndUpdate({_id: newsID}, fields);
            return functions.success(res, "News edited successfully");
        }
        return functions.setError(res, "News not found!", 505);
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.deleteNews = async(req, res, next) => {
    try {
        let newsID = Number(req.query.newsID);
        if (newsID) {
            let news = await functions.getDataDeleteOne(News ,{_id: newsID});
            if (news.deletedCount===1) {
                return functions.success(res, `Delete news with _id=${newsID} success`);
            }else{
                return functions.success(res, "News not found");
            }
        }
        return functions.setError(res, "Missing input newsID", 500);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//---------------------------------------------------------controller quan ly bang gia-----------------------------------------------

//api lay ra danh sach va tim kiem tin
exports.getListPriceList = async(req, res, next)=>{
    try{
        //lay cac tham so dieu kien tim kiem tin
        let request = req.body;
        let _id = request._id,
            time = request.time,
            type = request.type

        let condition = {};
        if(_id) condition._id = Number(_id);
        if(type) condition.type = Number(type);
        if(time) condition.time = new RegExp(time);
        let fields = {_id: 1, time: 1, unitPrice: 1, discount: 1, intoMoney: 1, vat: 1, intoMoneyVat: 1};

        let listPriceList = await PriceList.find(condition, fields);
        return functions.success(res, 'Get list PriceList success', { data: listPriceList })
    }catch(error){
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.update = async(req, res, next) => {
    try{
        if(!req.body.newsID)
            return functions.setError(res, "Missing input value id news!", 404);
        let newsID = req.body.newsID;
        let fields = req.info;
            fields.updateTime = Date(Date.now());
        let existsNews = await News.findOne({_id: newsID});
        if (existsNews) {
            
            await News.findOneAndUpdate({_id: newsID}, fields);
            return functions.success(res, "News edited successfully");
        }
        return functions.setError(res, "News not found!", 505);
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}


//-------------------------------------------------------controller quan ly tai khoan(da xac nhan opt va chua xac nhan)tk gian hang-------------------------

exports.getListUser = async(req, res, next)=>{
    try{
        //lay cac tham so dieu kien tim kiem tin
        let request = req.body;
        let authentic = request.authentic,// phan biet tai khoan bt va tk gian hang(xac thuc va chua xac thuc)
            _id = request._id,
            userName = request.userName,
            email = request.email,
            phoneTK = request.phoneTK,
            timeFrom = request.timeFrom,
            timeTo = request.timeTo
        let condition = {};
        if(_id) condition._id = Number(_id);
        if(authentic) condition.authentic = Number(authentic);
        if(userName) condition.userName = new RegExp(userName);
        if(email) condition.email = new RegExp(email);
        if(phoneTK) condition.phoneTK = new RegExp(phoneTK);

        let fields = {avatarUser: 1, _id: 1, userName: 1, email: 1, phoneTK: 1, createdAt: 1, money: 1};

        let listUsers = await Users.find(condition, fields);
        return functions.success(res, 'Get list Users success', { data: listUsers })
    }catch(error){
        console.log(error)
        return functions.setError(res, error)
    }
}


exports.getAndCheckDataUser = async(req, res, next) => {
    try {
        let {userName, email, phoneTK, phone, money} = req.body;

        if(!userName || !phoneTK) {
            return functions.setError(res, "Missing input value", 404)
        }
        // them cac truong muon them hoac sua
        req.info = {
            userName: userName,
            phoneTK: phoneTK,
            email: email,
            phone: phone,
            money: money
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createUser = async(req, res, next) => {
    try{
        let fields = req.info;
        const maxIdUser = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIdUser;
        if (maxIdUser) {
            newIdUser = Number(maxIdUser._id) + 1;
        } else newIdUser = 1;
        fields._id = newIdUser;
        fields.createdAt = Date(Date.now());
        let news = new Users(fields);
        await news.save();
        return functions.success(res, 'Create news RN365 success!');
    }catch(e){
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateUser = async(req, res, next) => {
    try{
        if(!req.body.userID)
            return functions.setError(res, "Missing input value id user!", 404);
        let userID = req.body.userID;
        let fields = req.info;
        fields.updateAt = Date(Date.now());
        let existsUser = await Users.findOne({_id: userID});
        if (existsUser) {

            await Users.findOneAndUpdate({_id: userID}, fields);
            return functions.success(res, "User edited successfully");
        }
        return functions.setError(res, "User not found!", 505);
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.deleteUser = async(req, res, next) => {
    try {
        let userID = Number(req.query.userID);
        if (userID) {
            let user = await functions.getDataDeleteOne(Users ,{_id: userID});
            if (user.deletedCount===1) {
                return functions.success(res, `Delete user with _id=${userID} success`);
            }else{
                return functions.success(res, "User not found");
            }
        }
        return functions.setError(res, "Missing input userID", 500);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}


//-------------------------------------------------------controller lich su nap the -------------------------

exports.getListHistory = async(req, res, next)=>{
    try{
        //lay cac tham so dieu kien tim kiem tin
        let request = req.body;
        let _id = request._id,
            userName = request.userName,
            userId = request.userId,
            seri = request.seri,
            time = request.time
        let condition = {};
        if(_id) condition._id = Number(_id);
        if(userName) condition.userName = new RegExp(userName);
        if(userId) condition.userId = new Number(userId);
        if(seri) condition.seri = new RegExp(seri);
        let fields = {_id: 1, userId: 1, seri: 1, time: 1, price: 1};

        let listHistory = await History.find(condition, fields);

        // lay them truong userName tu model Users
        for(let i=0; i<listHistory.length; i++){
            let user = await Users.find({_id: listHistory[i].userId});
            listHistory[i].userName = user.userName;
        }

        return functions.success(res, 'Get list history success', { data: listHistory })
    }catch(error){
        console.log(error)
        return functions.setError(res, error)
    }
}


//-------------------------------------------------------controller quan ly blog -------------------------

exports.getListBlog = async(req, res, next) => {
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
            let title = req.body.title;
            let blogId = req.body.blogId;
            let listCondition = {};

            // dua dieu kien vao ob listCondition
            if(title) listCondition.title =  new RegExp(title);
            if(blogId) listCondition._id =  Number(blogId);
            let fieldsGet =
                {
                    adminId: 1, langId: 1,title: 1,url: 1,image: 1,keyword: 1,sapo: 1,des: 1,detailDes: 1,
                    date: 1,adminEdit: 1,dateLastEdit: 1,order: 1,active: 1, new: 1, hot: 1, titleRelate: 1, contentRelate: 1
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

exports.getAndCheckDataBlog = async(req, res, next) => {
    try {
        let image = req.files.image;
        let {adminId,title,url,des,keyword, sapo, active, hot, detailDes , titleRelate, contentRelate, newStatus, date, dateLastEdit} = req.body;
        let fields = [adminId, title, url, image, des,keyword, sapo, detailDes, titleRelate, contentRelate];
        for(let i=0; i<fields.length; i++){
            if(!fields[i])
                return functions.setError(res, `Missing input value ${i+1}`, 404);
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

        if(!fields.date) {
            fields.date = Date(Date.now());
        }
        //luu anh
        let image = fields.image;
        if(!await functions.checkImage(image.path)){
            return functions.setError(res, 'ảnh sai định dạng hoặc lớn hơn 2MB', 405);
        }
        serviceRN.uploadFileRN2(folderImg,newIdBlog,image);
        fields.image = serviceRN.createLinkFileRaonhanh(folderImg, newIdBlog, image.name);
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
        if(!fields.dateLastEdit){
            fields.dateLastEdit = Date(Date.now());
        }
        let image = fields.image;
        if(!await functions.checkImage(image.path)){
            return functions.setError(res, 'ảnh sai định dạng hoặc lớn hơn 2MB', 405);
        }
        let existsBlog = await Blog.findOne({_id: _id});
        if (existsBlog) {
            // xu ly anh
            let linkImg = existsBlog.image.split("/");
            let len = linkImg.length;
            // functions.deleteImgRaoNhanh(folderImg, linkImg[len-2], linkImg[len-1]);
            serviceRN.uploadFileRN2(folderImg, _id, image);
            fields.image = serviceRN.createLinkFileRaonhanh(folderImg, _id, image.name);

            //cap nhat du lieu
            await Blog.findByIdAndUpdate(_id, fields);
            return functions.success(res, "Blog edited successfully");
        }

        return functions.setError(res, "Blog not found!", 505);
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}


//-------------------------------------------------------controller giá ghim tin đăng -------------------------
//api danh sách và tìm kiếm giá ghim tin đăng
exports.getListNewWithPin = async (req,res, next)=> {
    try {
        if(req.body){
            const { _id, time, type } = req.body;
            let query = {};
            if (_id) {
                query._id = _id;
            }
            if (time) {
                query.time = time;
            }
            if (type && [1, 5, 3, 4].includes(type)) {
                query.type = type;
            }
            const priceList = await PriceListRN.find(query);
            return functions.success(res, 'Get List Search New With Pin', { data: priceList })
        } else {
            const typeList = [1, 5, 3, 4];
            const priceList = await PriceListRN.find({ type: { $in: typeList } });
            return functions.success(res, 'Get ListNewWithPin', { data: priceList })
        }
    } catch (error) {
        console.error(error);
        return functions.setError(res, error)
    }
}
//api tạo mới ghim tin đăng
exports.createNewWithPin = async (req,res, next)=> {
    try {
        const {
            time,
            unitPrice,
            discount,
            intoMoney,
            vat,
            intoMoneyVat,
            type,
            cardGift,
            newNumber
        } = req.body;
        if (![1, 5, 3, 4].includes(Number(type))) {
            // kiểm tra có phải loại ghim tin
            return res.status(400).json({ message: 'Type not vaild' });
        }
        // kiểm tra các trường cần phải cos
        if(typeof discount === "number" && typeof vat === "number"
            && typeof type === "number" && typeof newNumber === "number" && _id !== null && cardGift !== null){
            // check tồn tại sản phẩm id lớn nất
            const maxIdCategory = await PriceListRN.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
            // tăng id lên 1 đơn vị
            let _id;
            if (maxIdCategory) {
               _id = Number(maxIdCategory._id) + 1;
            } else _id = 1;
            // tạo mới tin ghim tin đăng
            const newPriceList = new PriceListRN({
                _id,
                time,
                unitPrice,
                discount,
                intoMoney,
                vat,
                intoMoneyVat,
                type,
                cardGift,
                newNumber
            });
            const savedPriceList = await newPriceList.save();
            return functions.success(res, 'Create Success', { data: savedPriceList })
        } else {
            return functions.setError(res, 'The input No Vaild', 400);
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, err)
    }
}

// api sửa ghim tin đăng
exports.putNewWithPin = async (req,res, next) =>{
    const { id } = req.params;
    const {
        time,
        unitPrice,
        discount,
        intoMoney,
        vat,
        intoMoneyVat,
        cardGift,
        newNumber
    } = req.body;
    try {
        const priceList = await PriceListRN.findById(id);
        if (!priceList) {
            return res.status(404).json({ message: '_id is notExist' });
        }
        if(typeof discount === "number" && typeof vat === "number"
            && typeof type === "number" && typeof newNumber === "number" && _id !== null && cardGift !== null) {
            priceList.time = time;
            priceList.unitPrice = unitPrice;
            priceList.discount = discount;
            priceList.intoMoney = intoMoney;
            priceList.vat = vat;
            priceList.intoMoneyVat = intoMoneyVat;
            priceList.cardGift = cardGift;
            priceList.newNumber = newNumber;
            const updatedPriceList = await priceList.save();
            return functions.success(res, 'Put Success', {data: updatedPriceList})
        } else {
            return functions.setError(res, 'The input No Vaild', 400);
        }
    } catch (error) {
        console.error(error);
        return functions.setError(res, error)
    }
}


//-------------------------------------------------------controller giá đẩy tin đăng -------------------------
// api danh sách và tìm kiếm đẩy tin đăng
exports.getListPushNew = async (req,res, next)=> {
    try {
        if(req.body){
            const { _id, time, type } = req.body;
            let query = {};
            if (_id) {
                query._id = _id;
            }
            if (time) {
                query.time = time;
            }
            if (type && [2].includes(type)) {
                query.type = type;
            }
            const priceList = await PriceListRN.find(query);
            return functions.success(res, 'Get List Search New With Push', { data: priceList })
        } else {
            const typeList = [2];
            const priceList = await PriceListRN.find({ type: { $in: typeList } });
            return functions.success(res, 'Get List New With Push', { data: priceList })
        }
    } catch (error) {
        console.error(error);
        return functions.setError(res, error)
    }
}

//api tạo mới đẩy tin đăng
exports.createNewWithPush = async (req,res, next)=> {
    try {
        const {
            time,
            unitPrice,
            discount,
            intoMoney,
            vat,
            intoMoneyVat,
            type = 2,
            cardGift,
            newNumber
        } = req.body;
        if(typeof discount === "number" && typeof vat === "number"
            && typeof type === "number" && typeof newNumber === "number" && _id !== null && cardGift !== null) {
            // check tồn tại sản phẩm id lớn nất
            const maxIdCategory = await PriceListRN.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
            let _id;
            // nếu tồn tại tăng 1 đơn vị
            if (maxIdCategory) {
                _id = Number(maxIdCategory._id) + 1;
            } else _id = 1;
            // tạo mới tin ghim tin đăng
        const newPriceList = new PriceListRN({
            _id,
            time,
            unitPrice,
            discount,
            intoMoney,
            vat,
            intoMoneyVat,
            type,
            cardGift,
            newNumber
        });
        const savedPriceList = await newPriceList.save();
        return functions.success(res, 'Create Success', { data: savedPriceList })}
        else {
                return functions.setError(res, 'The input No Vaild', 400);
            }
    } catch (error) {
        console.error(error);
        return functions.setError(res, error)
    }
}

// api sửa giá đẩy tin đăng
exports.putNewWithPin = async (req,res, next) =>{
    const { id } = req.params;
    const {
        time,
        unitPrice,
        discount,
        intoMoney,
        vat,
        intoMoneyVat,
        cardGift,
        newNumber
    } = req.body;
    try {
        const priceList = await PriceListRN.findById(id);
        // nếu không tồn tại
        if (!priceList) {
            return res.status(404).json({ message: '_id is notExist' });
        }
        // chuẩn bị trường sửa
        priceList.time = time;
        priceList.unitPrice = unitPrice;
        priceList.discount = discount;
        priceList.intoMoney = intoMoney;
        priceList.vat = vat;
        priceList.intoMoneyVat = intoMoneyVat;
        priceList.cardGift = cardGift;
        priceList.newNumber = newNumber;
        // sửa
        const updatedPriceList = await priceList.save();
        return functions.success(res, 'Put Success', { data: updatedPriceList })
    } catch (error) {
        console.error(error);
        return functions.setError(res, error)
    }
}


//-------------------------------------------------------controller Danh sách lỗi đăng kí -------------------------
// api Danh sách lỗi đăng kí
exports.failRegister = async (req,res, next) => {
    try {
        // danh sách User trùng lặp số điện thoại
        const usersWithDuplicatePhoneTK = await Users.aggregate([
            {
                $match: {
                    phoneTK: { $ne: null } // lấy những Users có phoneTK không phải null
                }
            },
            {
                $group: {
                    _id: "$phoneTK",
                    users: {
                        $push: {
                            _id: "$_id" || null,
                            email: "$email" || null,
                            phone: "$phone" || null,
                            userName: "$userName" || null,
                            createdAt: "$createdAt" || null,
                            emailContact: "$emailContact" || null
                        }
                    }
                }
            },
            {
                $match: {
                    "users.1": { $exists: true } // Chỉ lấy những Users có phoneTK trùng nhau
                }
            },
            {
                $project: {
                    _id: 0,
                    phoneTK: "$_id",
                    users: 1
                }
            }
        ]);
        // danh sách User trùng lặp email
        const usersWithDuplicateEmail = await Users.aggregate([
            {
                $match: {
                    email: { $ne: null } // Chỉ lấy những Users có email không phải null
                }
            },
            {
                $group: {
                    _id: "$email",
                    users: {
                        $push: {
                            _id: "$_id" || null,
                            email: "$email" || null,
                            phone: "$phone" || null,
                            userName: "$userName" || null,
                            createdAt: "$createdAt" || null,
                            emailContact: "$emailContact" || null
                        }
                    }
                }
            },
            {
                $match: {
                    "users.1": { $exists: true } // lấy những Users có email trùng nhau
                }
            },
            {
                $project: {
                    _id: 0,
                    email: "$_id",
                    users: 1
                }
            }
        ]);
        let FailUser = [];
        // đẩy dữ liệu đã  lọc vào mảng
        FailUser.push(usersWithDuplicatePhoneTK,usersWithDuplicateEmail)
        return functions.success(res, 'List Fail User', { data: FailUser })
    } catch (error) {
        return functions.setError(res, error)
    }
}
//-------------------------------------------------------API báo cáo tin-------------------------
// tạo mới
exports.createReport = async (req,res,next) => {
    try {
            const reportNewsData = req.body;
        console.log(reportNewsData)
            const newReportNews = new ReportNews(reportNewsData);
            const savedReportNews = await newReportNews.save();
        console.log(savedReportNews)
            res.status(201).json(savedReportNews);
    }  catch (error) {
        return functions.setError(res, error)
    }
}
// api danh sách tìm kiếm tin báo cáo
exports.getListNewReports = async (req,res, next)=> {
    try {
            let { id_user, userName, problem, startDate, endDate} = req.body;
            // nếu mục tìm kiếm có tồn tại tên người báo cáo
            if (userName && id_user == null){
                console.log(1)
                const userReportWithUserName = await Users.findOne({userName: userName });
                // nếu có người dùng gán id tìm kiếm = id người dùng
                if (userReportWithUserName) {
                    console.log(2)
                    id_user = userReportWithUserName.id
                } else {
                    console.log(3)
                    id_user = null
                }
            }
            let query = {};
            query.id_user = id_user;
            if (problem) {
                query.problem = problem;
            }
            if(startDate){
                query.startDate = startDate;
            }
            if(endDate){
                query.endDate = endDate;
            }
            console.log(query,22)
            let fields = {id_user: 1, problem: 1, reportDetail: 1};
            // let reportNews= await ReportNews.find(query,fields);
            const reportNews = await functions.pageFind(ReportNews,query,null,null,null,fields);
            // console.log(reportNewss)
            console.log(reportNews)
            for (let i = 0; i < reportNews.length; i++ ){
                let Userss = await Users.findOne({_id: reportNews[i].id_user});
                reportNews[i].userName = Userss.userName
            }
            return functions.success(res, "get list report success", {data: reportNews });
    } catch (error) {
        console.log("Err from server", error);
        return functions.setError(res, error)
    }
}
// api sửa tin báo cáo
exports.fixNewReport = async (req,res,next) => {
    try{
        const { id } = req.params;
        const Report = await ReportNews.findOneAndUpdate({_id: id},{fixed: 1}, {
            new: true
        })
        return functions.success(res, "Fix report success", {data: Report });
    } catch (error) {
        console.log("Err from server", error);
        return functions.setError(res, error)
    }
}
//-------------------------------------------------------API chiet khau nap the-------------------------
// tạo
exports.createDiscount = async (req,res,next) => {
    try {
        const reportNewsData = req.body;
        console.log(reportNewsData)
        const newReportNews = new NetworkOperator(reportNewsData);
        const savedReportNews = await newReportNews.save();
        console.log(savedReportNews)
        res.status(201).json(savedReportNews);
    }  catch (error) {
        return functions.setError(res, error)
    }
}
// api tìm kiếm và danh sách chiết khấu
exports.getListDiscountCard = async (req,res,next) => {
    try{
        let { id, nameBefore} = req.body;
        let condition = {}
        if(id) condition._id = id;
        if(nameBefore) condition.nameBefore = nameBefore;
        let fields = {_id: 1, nameBefore: 1, discount: 1};
        let disscountList = await functions.pageFind(NetworkOperator,condition,null,null,null,fields);
        return functions.success(res, "Get List Report Success", {data: disscountList });
    } catch (error){
        return functions.setError(res, error)
    }
}
// api update Discount for Card
exports.updateDiscount = async (req,res,next) => {
    try{
        let { id } = req.params;
        let {nameBefore, nameAfter, discount } = req.body;
        //  nếu có param Id thì trả ra thông tin để sưả
        if(id && !nameBefore){
            console.log(1)
            const netWorkOperator = await NetworkOperator.findOne({_id: id})
            return functions.success(res, "Get Data", {data: netWorkOperator });
        } else if(id && nameBefore && nameAfter && discount) {
            console.log(2)
        // nếu có đủ body thì cập nhật thông tin
            const update ={
                nameBefore: nameBefore,
                nameAfter: nameAfter,
                discount: discount
            }
            const upDateDiscount = await NetworkOperator.findOneAndUpdate({_id: id},update,{
                new: true
            })
            return functions.success(res, "Update Discount Success", {data: upDateDiscount });
        } }catch (error){
        return functions.setError(res, error)
    }
}



