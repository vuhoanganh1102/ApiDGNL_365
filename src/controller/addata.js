import axios from 'axios'
import mongoose from "mongoose";
import Users from "../model/Users.js"
import User from '../../../../Downloads/TestNode/models/User.js';
const ObjectId = mongoose.Types.ObjectId;
export const getData = async (req, res, next) => {
    try {
        await axios({
            method: "post",
            url: "http://43.239.223.142:9006/api/users/TakeDataUser",
            data: {
            },
            headers: { "Content-Type": "multipart/form-data" },
        }).then((response) => {
            postData(response.data.data.listUser)
            return res.status(200).json(response.data.data.listUser)
        });

    } catch (err) {
        console.log(err);
    }
};
export const getDataUpdate = async (req, res, next) => {
    try {
        const { data } = await axios({
            method: "post",
            url: "https://timviec365.vn/api/get_list_user.php?page=1",
            data: {
            },
            headers: { "Content-Type": "multipart/form-data" },
        })
        const response = {
            data: data
        }
        await getUpdateData(response)
        return res.status(200).json(response);

    } catch (err) {
        console.log(err);
    }
};
const postData= async(data)=>{
    try{
        data.forEach(async(element) => {
            if(element.type365===0){
                const insert= new Users({
                    _id:element._id,
                    email:element.email,
                    password:element.password,
                    type:element.type365,
                    idTimViec365:element.idTimViec,
                    idQLC:element.id365,
                    userName:element.userName,
                    avatarUser:element.avatarUser,
                    inForCandidateTV365:{user_id:element._id}
                })
                await insert.save()
            }
            else if(element.type365===1){
                const insert= new Users({
                    _id:element._id,
                    email:element.email,
                    password:element.password,
                    type:element.type365,
                    idTimViec365:element.idTimViec,
                    idQLC:element.id365,
                    userName:element.userName,
                    avatarUser:element.avatarUser,
                    inForEmployee:{user_id:element._id}
                })
                await insert.save()

            }
            else{
                const insert= new Users({
                    _id:element._id,
                    email:element.email,
                    password:element.password,
                    type:element.type365,
                    idTimViec365:element.idTimViec,
                    idQLC:element.id365,
                    userName:element.userName,
                    avatarUser:element.avatarUser,
                    inForCompanyCC:{user_id:element._id}
                })
                await insert.save()
            }
        });

    } catch(err){
        console.log(err)
    }
}
const getUpdateData=async(data)=>{
    data.data.forEach(async(item)=>{
       let check= User.findOne({idTimViec365:item.use_id})
       if(check){
        let update={
            phoneTK:item.use_phone_tk,
            city:item.use_city ,
            district:item.use_quanhuyen,
            address:item.use_address,
            createAt:item.use_create_time,
            updatedAt:item.use_update_time,
            authentic:item.use_authentic,
            chat365_secret:item.chat365_secret,
        }
       await User.updateOne(update)
       }
       else{
        const insert= new Users({
            _id:item.chat365_id,
            email:item.use_email,
            password:item.use_pass,
            type:0,
            idTimViec365:element.use_id,
            idQLC:item.id_qlc,
            userName:item.use_first_name,
            avatarUser:item.use_logo,
            phoneTK:item.use_phone_tk,
            city:item.use_city ,
            district:item.use_quanhuyen,
            address:item.use_address,
            createAt:item.use_create_time,
            updatedAt:item.use_update_time,
            authentic:item.use_authentic,
            chat365_secret:item.chat365_secret,
            inForCandidateTV365:{user_id:item.chat365_id}
        })
        await insert.save()
       }
    })
}
