const fnc = require("../../services/GiaSu/functions")
const functions = require("../../services/functions")
const Users = require("../../models/Users")
const UserExperience = require("../../models/GiaSu/UserExperience")

exports.updateInfoParent = async(req, res, next) => {
    try {
        let idGiaSu = req.user.data.idGiaSu;
        let data = [];
        const { userName, emailContact, address, phone, birthday, gender,  ugs_about_us,ugs_city,ugs_county } = req.body;
        let File = req.files || null;
        let avatarUser = null;
            if(!userName) {
                return functions.setError(res, "userName không được để trống")
            }
            // if(!emailContact) {
            //     return functions.setError(res, "emailContact không được để trống")
            // }
            // if(!phone) {
            //     return functions.setError(res, "phone không được để trống")
            // }
            if(!address) {
                return functions.setError(res, "address không được để trống")
            }
            if(!birthday) {
                return functions.setError(res, "birthday không được để trống")
            }
            if(!gender) {
                return functions.setError(res, "gender không được để trống")
            }
            if(!ugs_city) {
                return functions.setError(res, "ugs_city không được để trống")
            }
            if(!ugs_county) {
                return functions.setError(res, "ugs_county không được để trống")
            }
            let findUser = await Users.findOne({ idGiaSu: idGiaSu, "inforGiaSu.ugs_ft": 2 })
            if (findUser) {
                if (File && File.avatarUser) {
                    let upload = await fnc.uploadAva("PH", File.avatarUser, ['.jpeg', 'gif', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ')
                    }
                    avatarUser = upload
                }
                data = await Users.updateOne({ idGiaSu: idGiaSu, "inforGiaSu.ugs_ft": 2}, {
                    $set: {
                        userName: userName,
                        emailContact: emailContact,
                        phone: phone,
                        avatarUser: avatarUser,
                        address: address,
                        updatedAt: functions.getTimeNow(),
                        "inForPerson.account.birthday": birthday?Date.parse(birthday) / 1000:undefined,
                        "inForPerson.account.gender": gender,
                        "inforGiaSu.ugs_about_us": ugs_about_us,
                        city : ugs_city,
                        district : ugs_county,
                    }
                })
                return functions.success(res, 'cập nhật thành công')
            } else {
                return functions.setError(res, "không tìm thấy Phụ huynh")
            }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message)
    }
}
exports.detailParent = async(req, res ) =>{
    try {
        let idGiaSu = req.user.data.idGiaSu;
        let user = await Users.aggregate([
            {$match : {idGiaSu : idGiaSu, "inforGiaSu.ugs_ft": 2 }},
            {$lookup : {
                from : "City",
                localField : "city",
                foreignField : "_id",
                as : "city"
            }},
            {$unwind : {path : "$city" , preserveNullAndEmptyArrays : true} },
            {$lookup : {
                from : "District",
                localField : "district",
                foreignField : "_id",
                as : "district"
            }},
            {$unwind : {path : "$district" , preserveNullAndEmptyArrays : true} },
            {$project : {
                userName : 1,
                emailContact : 1,
                phone : 1,
                avatarUser : 1,
                address : 1,
                updatedAt : 1,
                "birthday" : "$inForPerson.account.birthday",
                "gender" : "$inForPerson.account.gender",
                "ugs_about_us" : "$inforGiaSu.ugs_about_us",
                "district" : "$district.name",
                "city" : "$city.name",
                
            }}
        ])
        if(user.length > 0) {
            const data = user[0]
            data.avatarUser = await fnc.createLinkFile("PH", data.updatedAt, data.avatarUser);
            data.updatedAt = new Date(data.updatedAt * 1000)
            data.birthday = new Date(data.birthday * 1000)
            return functions.success(res , "lấy thành công" ,{data})
        }
        return functions.setError(res, "không tìm thấy phụ huynh")
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}



exports.updateInfoTeacher = async(req, res, next) => {
    try {
        let idGiaSu = req.user.data.idGiaSu;
        let data = [];
        const { userName, emailContact, address, phone, birthday, gender,  ugs_about_us,ugs_city_gs,ugs_county_gs,married,ugs_class_teach,ugs_tutor_style,ugs_school,ugs_graduation_year,ugs_specialized,ugs_workplace,ugs_achievements,experience } = req.body;
        let File = req.files || null;
        let avatarUser = null;
       
            let findUser = await Users.findOne({ idGiaSu: idGiaSu, "inforGiaSu.ugs_ft": 1 })
            if (findUser) {
                if (File && File.avatarUser) {
                    let upload = await fnc.uploadAva("GS", File.avatarUser, ['.jpeg', 'gif', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ')
                    }
                    avatarUser = upload
                } 
                //b1 + b2
                data = await Users.updateOne({ idGiaSu: idGiaSu, "inforGiaSu.ugs_ft": 1}, {
                    $set: {
                        userName: userName,
                        emailContact: emailContact,
                        phone: phone,
                        avatarUser: avatarUser,
                        address: address,
                        updatedAt: functions.getTimeNow(),
                        "inForPerson.account.birthday": birthday?Date.parse(birthday) / 1000:undefined,
                        "inForPerson.account.gender": gender,
                        "inForPerson.account.married": married,
                        "inforGiaSu.ugs_about_us": ugs_about_us,
                        "inforGiaSu.ugs_tutor_style": ugs_tutor_style,
                        "inforGiaSu.ugs_class_teach": ugs_class_teach,
                        "inforGiaSu.ugs_school": ugs_school,
                        "inforGiaSu.ugs_graduation_year": ugs_graduation_year,
                        "inforGiaSu.ugs_specialized": ugs_specialized,
                        city : ugs_city_gs,
                        district : ugs_county_gs,
                        "inforGiaSu.ugs_workplace": ugs_workplace,
                        "inforGiaSu.ugs_achievements": ugs_achievements,
                        "inForPerson.account.experience": experience,
                    }
                })
                //b3
                let experiences = new UserExperience({

                })
                //b4

                return functions.success(res, 'cập nhật thành công')
            } else {
                return functions.setError(res, "không tìm thấy Phụ huynh")
            }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}