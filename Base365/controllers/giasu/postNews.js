const fnc = require("../../services/GiaSu/functions")
const functions = require("../../services/functions")
const Users = require("../../models/Users")
const City = require("../../models/City")
const District = require("../../models/District")
const PostFindTutor = require("../../models/GiaSu/PostFindTutor")
const AllSubject = require("../../models/GiaSu/AllSubject")
const TeachingSchedule = require("../../models/GiaSu/TeachingSchedule")
const ClassTeach = require("../../models/GiaSu/ClassTeach")
const Notification = require("../../models/GiaSu/Notification")
const InviteTeach = require("../../models/GiaSu/InviteTeach")


exports.post = async(req, res) =>{
    try{
        let idGiaSu = req.user.data.idGiaSu;

        let {pft_summary,alias, as_id, as_detail, ct_id , city_detail, pft_form, pft_time, pft_nb_student,pft_nb_lesson,pft_gender,pft_school_day,pft_phone, city_id ,pft_address,pft_detail,pft_price_type , pft_price ,pft_end,pft_month, tutor_style , 
        st2,
        st3,
        st4,
        st5, 
        st6, 
        st7, 
        scn,
        ct2, 
        ct3, 
        ct4, 
        ct5, 
        ct6, 
        ct7, 
        ccn,
        tt2, 
        tt3, 
        tt4, 
        tt5, 
        tt6, 
        tt7, 
        tcn, 
        } = req.body
        
        if(as_id, as_detail, ct_id , city_detail){
            let numPost = await PostFindTutor.count({ugs_id : idGiaSu})
            let now = new Date()
            let time = new Date(pft_time)
            let d1 = Date.parse(now)/1000
            let d2 = d1 + 86400 
            let num_day_post =  await PostFindTutor.count({ugs_id : idGiaSu, day_post : {$gte : d1 , $lte : d2} })
            if( num_day_post < 24){
                let max = await functions.getMaxIdByField(PostFindTutor, "pft_id")
                let max1 = await functions.getMaxIdByField(TeachingSchedule, "ts_id")
                console.log(max)
                let last_post =  await PostFindTutor.findOne({pft_id : Number(max) - 1 })
                // console.log(last_post)
                let time_post = 0
                if(last_post){
                    time_post = last_post.day_post
                }else{
                    time_post = 0
                }
                console.log(d1 - time_post )
                if(d1 - time_post >= 600){
                    // let check_exits = await PostFindTutor.findOne({ugs_id : idGiaSu,as_id: as_id ,as_detail :as_detail, ct_id: ct_id, city_detail: city_detail }).lean()
                    // if(!check_exits){
                        // let title1 = await AllSubject.findOne({
                        //     as_id : as_detail
                        // })
                        // let title2 = await AllSubject.findOne({
                        //     as_id : as_id
                        // })
                        // let 
                        // if (as_detail != null && as_detail != '') {
                        //     tittle_as = title2.as_name + ' - ' + title1.as_name
                        // }else{
                        //     tittle_as = title2.as_name
                        // }
                        let price = pft_price
                        if(pft_price_type != 0 && pft_price_type == 2){
                            price = `${pft_price},${pft_end}`;
                        }
                        const posts = new PostFindTutor({
                            pft_id: max,
                            ugs_id : idGiaSu,
                            pft_summary: pft_summary,
                            alias: alias,
                            as_id: as_id,
                            ct_id: ct_id,
                            as_detail: as_detail,
                            pft_form: pft_form,
                            pft_time: Date.parse(time)/1000,
                            pft_nb_student: pft_nb_student,
                            pft_nb_lesson: pft_nb_lesson,
                            pft_gender: pft_gender,
                            tutor_style: tutor_style,
                            pft_school_day: pft_school_day,
                            pft_phone: pft_phone,
                            city_id: city_id,
                            city_detail: city_detail,
                            pft_address: pft_address,
                            pft_detail: pft_detail,
                            pft_price: price,
                            pft_price_type: pft_price_type,
                            pft_month: pft_month,
                            pft_view: "",
                            pft_status: 1,
                            active: 1,
                            trangthai_lop: 0,
                            day_post: d1,
                            day_update: d1,

                        })
                        await posts.save()
                        let insertSchedule = new TeachingSchedule({
                            ts_id : max1,
                            pft_id: max,
                            st2 : st2,
                            st3 : st3,
                            st4 : st4,
                            st5 : st5,
                            st6 : st6,
                            st7 : st7,
                            scn : scn,
                            ct2 : ct2,
                            ct3 : ct3,
                            ct4 : ct4,
                            ct5 : ct5,
                            ct6 : ct6,
                            ct7 : ct7,
                            ccn : ccn,
                            tt2 : tt2,
                            tt3 : tt3,
                            tt4 : tt4,
                            tt5 : tt5,
                            tt6 : tt6,
                            tt7 : tt7,
                            tcn : tcn,
                        })
                        await insertSchedule.save()
                        await Users.updateOne({idGiaSu : idGiaSu, }, {
                            "inforGiaSu.check_index": 1 
                        })
                        return functions.success(res, "lấy thành công", {posts, insertSchedule})
                    // }
                    // return functions.setError(res , "Tin chưa có môn học, lớp và quận huyện.")
                }
                return functions.setError(res , "Bạn vừa mới đăng tin, đợi 10 phút sau để đăng tin tiếp.")
            }
            return functions.setError(res , "Bạn đã đăng 24 tin trong ngày hôm này")
        }
        return functions.setError(res , "nhập thiếu 1 trong các trường:as_id, as_detail, ct_id , city_detail")

    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.editPost = async(req, res) =>{
    try{
        let idGiaSu = req.user.data.idGiaSu;

        let {pft_id, pft_summary,alias, as_id, as_detail, ct_id , city_detail, pft_form, pft_time, pft_nb_student,pft_nb_lesson,pft_gender,pft_school_day,pft_phone, city_id ,pft_address,pft_detail,pft_price_type , pft_price ,pft_end,pft_month, tutor_style ,
        st2,
        st3,
        st4,
        st5, 
        st6, 
        st7, 
        scn,
        ct2, 
        ct3, 
        ct4, 
        ct5, 
        ct6, 
        ct7, 
        ccn,
        tt2, 
        tt3, 
        tt4, 
        tt5, 
        tt6, 
        tt7, 
        tcn, 
        } = req.body
        if(!pft_id){
            return functions.setError(res, "vui long nhap pft_id de cap nhat tin" )
        }
        let time = new Date(pft_time)
        let now = new Date()
        let check = await PostFindTutor.findOne({
            pft_id:pft_id
        });
        if(check){

            const posts = await PostFindTutor.updateOne({
                pft_id: pft_id,
            },{
                ugs_id : idGiaSu,
                pft_summary: pft_summary,
                alias: alias,
                as_id: as_id,
                ct_id: ct_id,
                as_detail: as_detail,
                pft_form: pft_form,
                day_update: Date.parse(now)/1000,
                pft_time: Date.parse(time)/1000,
                pft_nb_student: pft_nb_student,
                pft_nb_lesson: pft_nb_lesson,
                pft_gender: pft_gender,
                tutor_style: tutor_style,
                pft_school_day: pft_school_day,
                pft_phone: pft_phone,
                city_id: city_id,
                city_detail: city_detail,
                pft_address: pft_address,
                pft_detail: pft_detail,
                pft_price: pft_price,
                pft_price_type: pft_price_type,
                pft_month: pft_month,
    
            })
            let insertSchedule = await TeachingSchedule.updateOne({
                pft_id: pft_id
            },{
                st2 : st2,
                st3 : st3,
                st4 : st4,
                st5 : st5,
                st6 : st6,
                st7 : st7,
                scn : scn,
                ct2 : ct2,
                ct3 : ct3,
                ct4 : ct4,
                ct5 : ct5,
                ct6 : ct6,
                ct7 : ct7,
                ccn : ccn,
                tt2 : tt2,
                tt3 : tt3,
                tt4 : tt4,
                tt5 : tt5,
                tt6 : tt6,
                tt7 : tt7,
                tcn : tcn,
            })
            return functions.success(res, "cap nhat thành công", {posts, insertSchedule})
        }
        return functions.setError(res, "khong tim thay tin dang" )

    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.allowSearchTeacher = async (req, res) =>{
    try{
        const idGiaSu = req.user.data.idGiaSu;
        const type = req.body.type
        let check = await Users.findOne({
            idGiaSu :idGiaSu,
            "inforGiaSu.ugs_ft": 1 
        })
        if(check) {
            await Users.updateOne({
                idGiaSu :idGiaSu,
                "inforGiaSu.ugs_ft": 1 
            },{
                "inforGiaSu.is_hide": type
            })
            return functions.success(res , "cap nhat thanh cong")
        }
        return functions.setError(res, "khong tim thay user" )
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.refreshTeacher = async (req, res) =>{
    try{
        const idGiaSu = req.user.data.idGiaSu;
        let now = new Date()
        let check = await Users.findOne({
            idGiaSu :idGiaSu,
            "inforGiaSu.ugs_ft": 1 
        })
        if(check) {
            await Users.updateOne({
                idGiaSu :idGiaSu,
                "inforGiaSu.ugs_ft": 1 
            },{
                "updatedAt": Date.parse(now)/1000
            })
            return functions.success(res , "cap nhat thanh cong")
        }
        return functions.setError(res, "khong tim thay user" )
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.refreshClass = async (req, res) =>{
    try{
        const id_lop = req.body.id_lop;
        let now = new Date()
        let check = await PostFindTutor.findOne({
            pft_id :id_lop,
        })
        if(check) {
            await PostFindTutor.updateOne({
                pft_id :id_lop,
            },{
                "day_update": Date.parse(now)/1000
            })
            return functions.success(res , "cap nhat thanh cong")
        }
        return functions.setError(res, "khong tim thay user" )
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.updateStatus = async (req, res) =>{
    try{
        const id_lop = req.body.id_lop
        const trangthai = req.body.trangthai
        let check = await PostFindTutor.findOne({
            pft_id :id_lop,
        })
        if(check) {
            await PostFindTutor.updateOne({
                pft_id :id_lop,
            },{
                trangthai_lop: trangthai
            })
            return functions.success(res , "cap nhat thanh cong")
        }
        return functions.setError(res, "khong tim thay lop hoc" )
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.deleteNoti = async (req, res) =>{
    try{
        const id = req.body.id;

        let idArray = id.split(",").map(Number)
        for(let i = 0 ; i< idArray.length ; i++ ){
            console.log(idArray[i])
        await Notification.deleteOne({ noti_id: { $in: idArray[i] }});
        }
        // await Notification.deleteMany({ noti_id: { $in: idArray }});
        return functions.success(res, 'Xoa thanh cong!');
  
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
 //phụ huynh mời dạy:
 exports.ParentInvite = async (req, res) =>{
    try{
        const pft_id = req.body.id_lop  
        const idGiaSu = req.user.data.idGiaSu;
        const ugs_teach = req.body.ugs_teach  
        const pft_address = req.body.pft_address  
        const it_status = req.body.it_status  
        const day_invitation_teach = req.body.day_invitation_teach  
        let idArray = pft_id.split(",").map(Number)
        for(let i = 0 ; i< idArray.length ; i++ ){
            //select info class
            console.log(idArray[i])
            let validateInvie = await InviteTeach.findOne({
                it_class_code : {$in: idArray[i]},
                $and : [{ it_status: {$ne : 3}}, 
                        { it_status: {$ne : 4}}
                    ],
                hidden :{$ne : 0},
            })
            let checkClass =  await PostFindTutor.findOne({
                ugs_id : idGiaSu,
                pft_id : idArray[i],
                trangthai_lop : 2
                
            })
            let getClass =  await PostFindTutor.findOne({
                ugs_id : idGiaSu,
                pft_id : idArray[i],
            }).select(" pft_address pft_nb_lesson -_id")
            if(getClass){
                let address = getClass.pft_address
                let pft_nb_lesson = getClass.pft_nb_lesson
                if(validateInvie){ 
                    // đã đc được mời dạy hoặc đề nghị
                    if(validateInvie.type_invite_suggest == 0){
                        // đc mời dạy rồi
                        if(validateInvie.hidden == 0){
                            let updateInvite = await InviteTeach.findOne({})
                        }else{

                        }
                    }else if(validateInvie.type_invite_suggest == 1){
                        //đề nghị rồi

                    }
                    


                }else{ 
                    // gia sư chưa được mời hoặc đề nghị

                }
            }
            console.log(validateInvie,checkClass,getClass)
        }



        return functions.success(res, "", {idArray})


    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.checkTittle = async (req, res) =>{
    try{
        const idGiaSu = req.user.data.idGiaSu;
        const title = req.body.title  
        if(title){
        let checkTitle =  await PostFindTutor.count({
            pft_summary : title, 
            ugs_id : idGiaSu 
        })
        if(checkTitle == 0) {
            return functions.success(res, "")
        }else{
            return functions.setError(res, "Title đã tồn tại")
        }
    }
    return functions.setError(res, "Chưa nhập Title")
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.listCity = async (req, res) =>{
    try{
        const name_city = req.body.name_city  
        let cond = {}
        if(name_city) cond.name = {$regex : name_city}
        let list =  await City.find(cond).select("name -_id")
        return functions.success(res, "lấy thành công", { list });
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.listDistrict = async (req, res) =>{
    try{
        const name_District = req.body.name_District  
        let cond = {}
        if(name_District) cond.name = {$regex : name_District}
        let list =  await District.find(cond).select("name -_id")
        return functions.success(res, "lấy thành công", { list });
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.listClassTeach = async (req, res) =>{
    try{
        const nameClass = req.body.nameClass  
        let cond = {}
        if(nameClass) cond.cit_name = {$regex : nameClass}
        let list =  await ClassTeach.find(cond).select("cit_name")
        return functions.success(res, "lấy thành công", { list });
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}
exports.listAllSubject = async (req, res) =>{
    try{
        const nameSubject = req.body.nameSubject  
        let cond = {}
        if(nameSubject) cond.as_name = {$regex : nameSubject}
        let list =  await AllSubject.find(cond).select("as_name")
        return functions.success(res, "lấy thành công", { list });
    }catch(e){
        console.log(e)
        return functions.setError(res, e.message )
    }
}

exports.detail = async(req, res ) =>{
    try {
        let idGiaSu = req.user.data.idGiaSu;
        let pft_id = Number(req.body.id_lop);
        if(!pft_id){
            return functions.setError(res, "vui long dien id_lop")
        }
        let user = await PostFindTutor.aggregate([
            {$match : {ugs_id : idGiaSu , pft_id: pft_id }},
            {$lookup : {
                from : "City",
                localField : "city_id",
                foreignField : "_id",
                as : "city"
            }},
            {$unwind : {path : "$city" , preserveNullAndEmptyArrays : true} },
            {$lookup : {
                from : "District",
                localField : "city_detail",
                foreignField : "_id",
                as : "district"
            }},
            {$unwind : {path : "$district" , preserveNullAndEmptyArrays : true} },
            {$lookup : {
                from : "Users",
                localField : "ugs_id",
                foreignField : "idGiaSu",
                as : "infoUsers"
            }},
            {$unwind : {path : "$infoUsers" , preserveNullAndEmptyArrays : true} },
            {$project : {
                "userName" : "$infoUsers.userName" ,
                "emailContact" : "$infoUsers.emailContact" ,
                "phone" : "$infoUsers.phone" ,
                "avatarUser" : "$infoUsers.avatarUser" ,
                "district" : "$district.name",
                "city" : "$city.name",


                "id_lop" : "$pft_id",
                "title" : "$pft_summary",
                "id_mon_hoc" : "$as_id",
                "chi_tiet_mon_hoc" : "$as_detail",
                "classTearch_id" : "$ct_id",
                "pft_form" : "$pft_form",
                "pft_time" : "$pft_time",
                "pft_nb_student" : "$pft_nb_student",
                "pft_nb_lesson" : "$pft_nb_lesson",
                "pft_gender" : "$pft_gender",
                "tutor_style" : "$tutor_style",
                "phi_nhan_lop" : "$pft_price",
                "pft_school_day" : "$pft_school_day",
                "pft_phone" : "$pft_phone",
                "pft_address" : "$pft_address",
                "pft_detail" : "$pft_detail",
                "pft_price_type" : "$pft_price_type",
                "pft_month" : "$pft_month",
                "pft_view" : "$pft_view",
                "pft_status" : "$pft_status",
                "active" : "$active",
                "trangthai_lop" : "$trangthai_lop",
                "day_post" : "$day_post",
                "day_update" : "$day_update",
                
            }}
        ])
        if(user.length > 0) {
            const data = user[0]
            data.avatarUser = await fnc.createLinkFile("PH", data.updatedAt, data.avatarUser);
            data.pft_time = new Date(data.pft_time * 1000)
            data.day_post = new Date(data.day_post * 1000)
            data.day_update = new Date(data.day_update * 1000)
            let schedule = await TeachingSchedule.findOne({pft_id: pft_id})
            return functions.success(res , "lấy thành công" ,{data,schedule})
        }
        return functions.setError(res, "không tìm thấy phụ huynh")
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}


