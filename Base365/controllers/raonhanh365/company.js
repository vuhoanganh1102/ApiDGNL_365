const fnc = require('../../services/functions');
const New = require('../../models/Raonhanh365/UserOnSite/New');
const CompanyRN = require('../../models/Users');
const md5 = require('md5');

// thông tin tài khoản
exports.comInfo = async(req, res, next) => {
    try {
        // chưa xong
        const user = req.user.data;
        const conditions = {
            $or: [
                { $and: [{ buySell: 1 }, { userID: user._id }] },
                { $and: [{ buySell: 2 }, { userID: user._id }] },
                { userID: user._id }
            ]
        };
        const data = await New.countDocuments(conditions);
        data.user = user;
        return await fnc.success(res, "Thành công", data);
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.getAndCheckData = async(req, res, next) => {
    try {
        let request = req.body,
            email = request.email,
            phoneTK = request.phoneTK,
            username = request.username,
            password = request.password,
            city = request.usc_city,
            district = request.usc_qh,
            address = request.usc_address,
            mst = request.thue,
            linkVideo = request.linkVideo,
            description = request.usc_mota,
            fromDevice = request.fromDevice,
            fromWeb = request.fromWeb,
            avatarUser = req.files.logo,
            ipAddressRegister = request.ipAddressRegister,
            videoType = req.files.videoType,
            lv = request.usc_lv,
            video = '',
            link = '',
            avatar = "",
            lvID = 0,
            listIDKD = [],
            idKD = 0,
            empID = 0;
            type = 1;// tai khoan cong ty
        let fields = [username, phoneTK, password, address];
        for(let i=0; i<fields.length; i++){
            if(!fields[i])
                return functions.setError(res, `Missing input value ${i+1}`, 404);
        }
        let avatarName;
        if(avatarUser){
            if(!await functions.checkImage(avatarUser.path)) {
                await functions.deleteImgVideo(avatarUser)
                return functions.setError(res, 'ảnh sai định dạng hoặc lớn hơn 2MB', 405)
            }
            avatarName = avatarUser.originalFilename;
        }
        
        req.info = {
            phoneTK: phoneTK,
            userName: userName,
            phone: phoneTK,
            email: email,
            password: md5(password),
            address: address,
            avatarUser: avatarName,
            city: city,
            type: type,
            inForCompany: {
                website: website,
                description: description,
                mst: mst
            }
        }
        return next();
    } catch (err) {
        console.log("Err from server", err);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.createCompany = async(req, res, next)=>{
    try{
        let fields = req.info;
        const maxIdCompany = await CompanyRN.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIdCompany;
        if (maxIdCompany) {
            newIdCompany = Number(maxIdCompany._id) + 1;
        } else newIdCompany = 1;
        fields._id = newIdCompany;
        let company = new CompanyRN(fields);
        await company.save();
        return functions.success(res, 'Create CompanyRN365 success!');
    }catch(err){
        console.log("Err from server", err);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.updateCompany = async(req, res, next) => {
    try{
        if(!req.body._id)
            return functions.setError(res, "Missing input value id company!", 404);
        let _id = req.body._id;
        let fields = req.info;
        let existsCompany = await CompanyRN.findOne({_id: _id});
        if (existsCompany) {
            await CompanyRN.findByIdAndUpdate(_id, fields);
            return functions.success(res, "Company edited successfully");
        }
        return functions.setError(res, "Company not found!", 505);
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}