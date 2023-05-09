const Users = require('../../models/Timviec365/Timviec/Users');
//mã hóa mật khẩu
const md5 = require('md5');

//token
const jwt = require('jsonwebtoken');

// Kết nối API
const axios = require('axios');

// Kết nối và sử dụng các hàm dùng chung
const functions = require('../../services/functions');

exports.addUserChat365 = async(req, res, next) => {
    try {
        const getDataUser = await axios.post("http://43.239.223.142:9006/api/users/TakeDataUser", {
            count: 0
        });

        let listUser = getDataUser.data.data.listUser;

        listUser.forEach(async element => {
            let email = element.email,
                phoneTK = element.phoneTK,
                type = element.type365;

            let CheckEmail = await functions.checkEmail(email);
            if (CheckEmail) {
                var account = { email, type };
            } else {
                var account = { phoneTK, type };
            }
            // console.log(account);
            let checkUser = await functions.getDatafindOne(Users, account);
            console.log(checkUser);
            if (!checkUser) {
                let user = new Users({
                    _id: element._id,
                    idQLC: takeData.data.data.id365,
                    type: takeData.data.data.type365,
                    phoneTK: takeData.data.data.email,
                    password: takeData.data.data.password,
                    userName: takeData.data.data.userName,
                    avatarUser: takeData.data.data.avatarUser,
                    lastActivedAt: takeData.data.data.lastActive,
                    isOnline: takeData.data.data.isOnline,
                    idTimViec365: takeData.data.data.idTimviec,
                    from: takeData.data.data.fromWeb,
                    chat365_secret: takeData.data.data.secretCode,
                    latitude: takeData.data.data.latitude,
                    longitude: takeData.data.data.longitude,
                })
            }
        });



        // res.json(getDataUser.data);

        // for (let j = 0; j < takeData.data.data.length; j++) {
        //     let CheckEmail = await functions.CheckEmail(takeData.data.data.email)
        //     let CheckPhoneNumber = await functions.CheckPhoneNumber(takeData.data.data.email)
        //     let checkUser = await functions.getDatafindOne(Users, { phoneTK: takeData.data.data.email, type: takeData.data.data.email })
        //     if (!checkUser && CheckPhoneNumber) {
        //         let user = new Users({
        //             _id: takeData.data.data._id,
        //             idQLC: takeData.data.data.id365,
        //             type: takeData.data.data.type365,
        //             phoneTK: takeData.data.data.email,
        //             password: takeData.data.data.password,
        //             userName: takeData.data.data.userName,
        //             avatarUser: takeData.data.data.avatarUser,
        //             lastActivedAt: takeData.data.data.lastActive,
        //             isOnline: takeData.data.data.isOnline,
        //             idTimViec365: takeData.data.data.idTimviec,
        //             from: takeData.data.data.fromWeb,
        //             chat365_secret: takeData.data.data.secretCode,
        //             latitude: takeData.data.data.latitude,
        //             longitude: takeData.data.data.longitude,
        //         })
        //     }
        //     if (!checkUser && CheckEmail) {
        //         let user = new Users({
        //             _id: takeData.data.data._id,
        //             idQLC: takeData.data.data.id365,
        //             type: takeData.data.data.type365,
        //             email: takeData.data.data.email,
        //             password: takeData.data.data.password,
        //             userName: takeData.data.data.userName,
        //             avatarUser: takeData.data.data.avatarUser,
        //             lastActivedAt: takeData.data.data.lastActive,
        //             isOnline: takeData.data.data.isOnline,
        //             idTimViec365: takeData.data.data.idTimviec,
        //             from: takeData.data.data.fromWeb,
        //             chat365_secret: takeData.data.data.secretCode,
        //             latitude: takeData.data.data.latitude,
        //             longitude: takeData.data.data.longitude,
        //         })
        //     }
        // }
        // }
        // res.json(await functions.success("Add dữ liệu thành công"))

    } catch (e) {
        // console.log("Đã có lỗi xảy ra khi đăng kí B1", e);
        // res.status(200).json(await functions.setError(200, "Đã có lỗi xảy ra"));
    }

}