const functions = require('../../services/functions');
const AdminUser = require('../../models/Raonhanh365/Admin/AdminUser');
const Category = require('../../models/Raonhanh365/Category');
const News = require('../../models/Raonhanh365/UserOnSite/New');
const PriceListRN = require('../../models/Raonhanh365/PriceList');
const BlogRaoNhanh365 = require('../../models/Raonhanh365/Admin/Blog');
const Users = require('../../models/Users');
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

exports.getListCategory = async(req, res, next)=>{
    try{
        console.log(req.body.data);
        let listCategory = await Category.find({});
        return functions.success(res, 'Get list category success', { data: listCategory })
    }catch(error){
        console.log(error)
        return functions.setError(res, error)
    }
}



//api danh sách và tìm kiếm gia ghim tin đăng
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

// api lấy ra danh sách, tìm kiếm blog theo id
exports.listBlog = async (req,res, next) => {
    try {
        if(req.query){
            const { blogId, categoryTitle } = req.query;
            let query = {};
            if (blogId) {
                query._id = blogId;
            }
            if (categoryTitle) {
                const category = await CategoryRaoNhanh365.findOne({ name: categoryTitle });
                if (category) {
                    query.categoryId = category._id;
                }
            }
            const blogList = await BlogRaoNhanh365.find(query);
            return functions.success(res, 'Search Blog Success', { data: blogList })
        } else {
            const blogList = await BlogRaoNhanh365.find();
            return functions.success(res, 'Get Blog Success', { data: blogList })
        }
    } catch (error) {
        console.error(error);
        return functions.setError(res, error)
    }
}
// api chỉnh sửa blog
exports.putBlog = async (req,res,next)=>{
    try {
        const { blogId } = req.params;
        const updatedBlogData = req.body;
        const blog = await BlogRaoNhanh365.findOne({ _id: blogId });
        if (!blog) {
            return res.status(404).json({ message: 'blog is not exist' });
        }
        blog.set(updatedBlogData);
        const updatedBlog = await blog.save();
        return functions.success(res, 'Put Blog Success', { data: updatedBlog })
    } catch (error) {
        console.error(error);
        return functions.setError(res, error)
    }
}

//api tạo mới blog
exports.createBlog = async (req,res,next)=>{
    try {
        const newBlogData = req.body;
        const newBlog = new BlogRaoNhanh365(newBlogData);
        // Lưu
        if(newBlogData.title && newBlogData.url){
            const createdBlog = await newBlog.save();
            return functions.success(res, 'Create Success', { data: createdBlog })
        }
    } catch (error) {
        console.error(error);
        return functions.setError(res, error)
    }
}

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
                    email: { $ne: null } // Chỉ lấy những Users có phoneTK không phải null
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
                    "users.1": { $exists: true } // lấy những Users có phoneTK trùng nhau
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
        FailUser.push(usersWithDuplicatePhoneTK,usersWithDuplicateEmail)
        return functions.success(res, 'List Fail User', { data: FailUser })
    } catch (error) {
        return functions.setError(res, error)
    }
}