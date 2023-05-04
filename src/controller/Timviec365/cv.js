import axios from 'axios'
import mongoose from "mongoose";
import User from "../../model/Timviec365/Timviec/Users.js"

export const RegisterSuccess = async (req, res) => {
    try {
      const UserName = req.body.UserName;
      const Email = req.body.Email;
      const Password = req.body.Password;
      if (req.body !== null && req.body.UserName !== null && req.body.Email !== null && req.body.Password !== null) {
        let newID = await User.find({}).sort({ _id: -1 }).limit(1).lean()
        newID = newID[0].toObject();
        const addID = newID._id + 1
        let finduser = await User.findOne({email: Email, userName: UserName, password: md5(Password)})
        if(finduser){
          return  res.status(200).json(createError(200, "da co tai khoan nay trong chat"));
        }
        const checkUser = await User.count({ _id: addID })
        if (checkUser === 0) {
          const themUser = await User.insertMany(({ _id: addID, email: Email, userName: UserName, password: md5(Password) }));
          if (themUser.length > 0) {
            res.json({
              "data": {
                "result": true,
                "message": "Đăng ký thành công",
                "listNameFile": null,
                "otp": null
              },
              "error": null
            })
          }else{
            res.status(200).json(createError(200, "Có lỗi xảy ra"));
          }
        } else {
          res.status(200).json(createError(200, "Tài khoản đã tồn tại"));
        }
      }
    }
    catch (err) {
      console.log(err);
      res.status(200).json(createError(200, "Thiếu thông tin truyền lên"));
    }
  
  }