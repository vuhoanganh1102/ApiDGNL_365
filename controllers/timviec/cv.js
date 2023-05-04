const Users = require('../../models/Timviec365/Timviec/Users')
const md5 = require('md5')

exports.index = (req, res, next) => {
    res.json('123 123123123') 
}

exports.RegisterB1 = async(req,res,next) =>{

    if(req.body.phoneTK ){
        const phoneTk = req.body.phoneTK
        const password = md5(req.body.password)
        const userName = req.body.userName
        const email = req.body.email
        const city = req.body.city
        const district = req.body.district
        const address = req.body.address
        const from = req.body.from
        const candiCateID = req.body.candiCateID
        const candiCityID = req.body.candiCityID
        const candiMucTieu = req.body.candiMucTieu

        // check số điện thoại đã đăng kí trong bảng user
        let checkUser = await Users.findOne({phoneTk: phoneTk})
        if(checkUser){
            return res.status(200).json(createError(200, "Số điện thoại đã được đăng kí"));
        }
        // check số điện thoại đã đăng kí trong bảng ứng viên chưa hoàn thiện hồ sơ
        let checkUserUV = await usersUnset.findOne({phoneTk: phoneTk})
        // nếu tồn tại số điện thoại trong bảng userunset thì update, không tồn tại thì thêm mới
        if(checkUserUV){
            let updateUserUv = await usersUnset.updateOne({password: password})
        }else{
            let UserUV = new UsersUnset()
        }
    }
}

