import axios from 'axios'
import mongoose from "mongoose";
import https from 'https'

//
import Users from "../model/Timviec365/Timviec/Users.js"
import newTV365 from '../model/Timviec365/Timviec/newTV365.js';
import blog from "../model/Timviec365/Timviec/blog.js";

const ObjectId = mongoose.Types.ObjectId;

export const getData = async (req, res, next) => {
    try {
        let i=0;
        let count=0
        while (i<3000){
            await axios({
                method: "post",
                url: "http://43.239.223.142:9006/api/users/TakeDataUser",
                data: {
                    count:count+i*100
                },
                timeout: 1200000, 
                httpsAgent: new https.Agent({ keepAlive: true }),
                headers: { "Content-Type": "multipart/form-data" },
            }).then((response) => {
                postData(response.data.data.listUser)
                return res.status(200).json()
            });
            i++
        }
  
    } catch (err) {
        console.log(err);
    }
};

export const getDataUpdate = async (req, res, next) => {
    try {
        const { data } = await axios({
            method: "post",
            url: "https://timviec365.vn/api/get_list_user.php?page=5",
            data: {
            },
            timeout: 60000, 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { "Content-Type": "multipart/form-data" },
        })
        const response = {
            data: data
        }
        // await getUpdateData(response)
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
        for (const item of data.data) {
          try {

            const user = await Users.findOne({ idTimViec365: item.use_id }).exec().then(async(user)=>{
            let dateCreate = new Date(item.use_create_time * 1000);
            let dateUpdate = new Date(item.use_update_time * 1000);
            let mongoDateCreate = new Date(dateCreate.getTime());
            let mongoDateUpdate = new Date(dateUpdate.getTime());
                if (user!=null) {
                    const update = {
                      phoneTK: item.use_phone_tk,
                      city: item.use_city,
                      district: item.use_quanhuyen,
                      address: item.use_address,
                      createdAt: mongoDateCreate,
                      updatedAt: mongoDateUpdate,
                      authentic: item.use_authentic,
                      chat365_secret: item.chat365_secret,
                    };
                    await Users.updateOne({ idTimViec365: item.use_id }, update).exec();
                  }
                  else if(item.chat365_id==0){
                        let id= await findMaxId()
                        let idUser=Number(id)+1;
                        await Users.findOne({_id: item.chat365_id}).exec().then(async(user)=>{
                            if (user!=null) {
                                const insert = new Users({
                                    _id:(Number(idUser)+1),
                                    email: item.use_email,
                                    password: item.use_pass,
                                    type: 0,
                                    idTimViec365: item.use_id,
                                    idQLC: item.id_qlc,
                                    userName: item.use_first_name,
                                    avatarUser: item.use_logo,
                                    phoneTK: item.use_phone_tk,
                                    city: Number(item.use_city),
                                    district: item.use_quanhuyen,
                                    address: item.use_address,
                                    createdAt:mongoDateCreate,
                                    updatedAt: mongoDateUpdate,
                                    authentic: item.use_authentic,
                                    chat365_secret: item.chat365_secret,
                                    inForCandidateTV365: { user_id: item.chat365_id },
                                  });
                                  await insert.save();
                            }
                            else{
                                const insert = new Users({
                                    _id:idUser,
                                    email: item.use_email,
                                    password: item.use_pass,
                                    type: 0,
                                    idTimViec365: item.use_id,
                                    idQLC: item.id_qlc,
                                    userName: item.use_first_name,
                                    avatarUser: item.use_logo,
                                    phoneTK: item.use_phone_tk,
                                    city: Number(item.use_city),
                                    district: item.use_quanhuyen,
                                    address: item.use_address,
                                    createdAt:mongoDateCreate,
                                    updatedAt: mongoDateUpdate,
                                    authentic: item.use_authentic,
                                    chat365_secret: item.chat365_secret,
                                    inForCandidateTV365: { user_id: item.chat365_id },
                                  });
                                  await insert.save();
                            }

                        })
                       
                     }
                     else {
                          
                                const insert = new Users({
                                    _id: item.chat365_id,
                                    email: item.use_email,
                                    password: item.use_pass,
                                    type: 0,
                                    idTimViec365: item.use_id,
                                    idQLC: item.id_qlc,
                                    userName: item.use_first_name,
                                    avatarUser: item.use_logo,
                                    phoneTK: item.use_phone_tk,
                                    city: Number(item.use_city),
                                    district: item.use_quanhuyen,
                                    address: item.use_address,
                                    createdAt:mongoDateCreate,
                                    updatedAt: mongoDateUpdate,
                                    authentic: item.use_authentic,
                                    chat365_secret: item.chat365_secret,
                                    inForCandidateTV365: { user_id: item.chat365_id },
                                  });
                                  await insert.save();
                            
                  }
            });
           
          } catch (error) {
            console.log(error);
          }
                
}
}

export const maxID=async ()=>{
    const insert= new Users({
        _id:2000000
    })
    await insert.save()
    await findMaxId()

}
const findMaxId = async () => {
    const item = await Users.findOne().sort({ _id: -1 }).exec();
    return item._id;
  };
  export const getDataNew = async (req, res, next) => {
    try {
        await axios({
            method: "post",
            url: "https://timviec365.vn/email2/testh4.php",
            data: {
            },
            headers: { "Content-Type": "multipart/form-data" },
        }).then(async(response) => {
            postDataNew(response.data)
            return res.status(200).json(response.data)
        });
    } catch (err) {
        console.log(err);
    }
};
const postDataNew=async(data)=>{
    try{
        data.forEach(async(element) => {
            let dateCreate = new Date(element.new_create_time * 1000);
            let dateUpdate = new Date(element.new_update_time * 1000);
            let dateHanNop = new Date(element.new_han_nop * 1000);
            let mongoDateCreate = new Date(dateCreate.getTime());
            let mongoDateUpdate = new Date(dateUpdate.getTime());
            let mongoDateHanNop = new Date(dateHanNop.getTime());
                const insert= new newTV365({
                    _id:element.new_id,
                    userID:element.usc_id,
                    title:element.new_title,
                    address:element.new_addr,
                    capBac:element.new_cap_bac,
                    exp:element.new_exp,
                    sex:element.new_gioi_tinh,
                    hinhThuc:element.new_hinh_thuc,
                    cateID:element.new_cat_id,
                    createTime:mongoDateCreate,
                    updateTime:mongoDateUpdate,
                    cityID:element.new_city,
                    districtID:element.new_qh_id,
                    bangCap:element.new_bang_cap,
                    hanNop:mongoDateHanNop,
                    newMoney:{
                        newId:element.new_id,
                        type:element.nm_type,
                        minValue:element.nm_min_value,
                        maxValue:element.nm_max_value,
                        unit:element.nm_unit,
                    },
                    newMulti:{
                        newId:element.new_id,
                        moTa:element.new_mota,
                        yeuCau:element.new_yeucau,
                        quyenLoi:element.new_quyenloi,
                        hoSo:element.new_ho_so,
                        lv:element.new_lv,
                    }
                })
                await insert.save()
            })

    } catch(err){
        console.log(err)
    }
}
export const getDataBlog = async (req, res, next) => {
    try {
        await axios({
            method: "post",
            url: 'https://timviec365.vn/api/get_list_blog.php?page=1',
            data: {
            },
            headers: { "Content-Type": "multipart/form-data" },
        }).then(async(response) => {
            postDataBlog(response.data)
            return res.status(200).json(response.data)
        });
    } catch (err) {
        console.log(err);
    }
};
const postDataBlog=async(data)=>{
    try{
        data.forEach(async(element) => {
            
            let date = new Date(element.new_date * 1000);
            let mongoDate= new Date(date.getTime());
            let dateLastEdit = new Date(element.new_date_last_edit * 1000);
            let mongoDateLastEdit= new Date(dateLastEdit.getTime());
                const insert= new blog({
                    _id:element.new_id,
                    adminID:element.admin_id,
                    langID:element.lang_id,
                    title:element.new_title,
                    titleRewrite:element.new_title_rewrite,
                    redirect301:element.new_301,
                    canonical:element.new_canonical,
                    mail:element.new_mail,
                    picture:element.new_picture,
                    teaser:element.new_teaser,
                    description:element.new_description,
                    thongTin:element.new_tt,
                    des:element.new_des,
                    keyword:element.new_keyword,
                    video:element.new_video,
                    categoryID:element.new_category_id,
                    categoryCB:element.new_category_cb,
                    date: mongoDate,
                    adminEdit:element.new_admin_edit,
                    dateLastEdit:mongoDateLastEdit,
                    order:element.new_order,
                    hits:element.new_hits,
                    active:element.new_active,
                    cateUrl:element.new_cate_url,
                    hot:element.new_hot,
                    new:element.new_new,
                    view:element.new_view,
                    urlLq:element.new_url_lq,
                    tagCate:element.new_tag_cate,
                    Vl:element.new_vl,
                    tdgy:element.new_tdgy,
                    ndgy:element.new_ndgy,
                    audio:element.new_audio,
                })
                await insert.save()
            })

    } catch(err){
        console.log(err)
    }
}