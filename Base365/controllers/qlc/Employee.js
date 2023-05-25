const Users = require('../../models/Users')
const functions = require('../../services/functions')
const md5 = require('md5');
//đăng kí tài khoản nhân viên 
exports.createEmpAcc = async (req,res)=>{
    
        const { userName, email , phoneTK, password, companyId, address } = req.body;
    
            if ((userName && password && companyId &&
                address && email && phoneTK) !== undefined) {
    
                    //  check email co trong trong database hay khong
                    let user = await functions.getDatafindOne(Users, { email: email , type : 2})
                    if (user == null) {
                            const user = await new Users({
                                _id: newMaxID,
                                email,
                                phoneTK,
                                userName: req.body.userName,
                                phone: req.body.phone,
                                avatarUser: req.body.avatarUser,
                                type: 2,
                                password: md5(password),
                                address: req.body.address,
                                otp: req.body.otp,
                                authentic: req.body.authentic,
                                fromWeb: "quanlichung.timviec365",
                                from: req.body.dk,
                                role: 0,
                                latitude: req.body.latitude,
                                longtitude: req.body.longtitude,
                                idQLC: req.body.idQLC,
                        })
                        await user.save().then(() => {
                            console.log("Thêm mới thành công ID Công ty: " + email + "," + phoneTK);
                        }).catch((e) => {
                            console.log(e);
                        });
                    } else {
                        await functions.setError(res, 'email đã tồn tại', 404);
                    }    
                
            }else {
                await functions.setError(res,'Một trong các trường yêu cầu bị thiếu',404)
         }
}