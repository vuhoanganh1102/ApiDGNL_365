const fnc = require("../../services/GiaSu/functions")
const functions = require("../../services/functions")
const Users = require("../../models/Users")
const PostFindTutor = require("../../models/GiaSu/PostFindTutor")
const AllSubject = require("../../models/GiaSu/AllSubject")


exports.post = async(req, res) =>{
    try{
        let idGiaSu = req.user.data.idGiaSu;

        let {as_id, as_detail, ct_id , city_detail} = req.body
        
        if(as_id, as_detail, ct_id , city_detail){
            let numPost = await PostFindTutor.count({ugs_id : idGiaSu})
            let now = new Date()
            let d1 = Date.parse(now)/1000
            let d2 = d1 + 86400 
            let num_day_post =  await PostFindTutor.count({ugs_id : idGiaSu, day_post : {$gte : d1 , $lte : d2} })
            if( num_day_post < 24){
                let max = await functions.getMaxIdByField(PostFindTutor, "pft_id")
                console.log(max)
                let last_post =  await PostFindTutor.findOne({pft_id : max }).lean()
                let time_post = 0
                if(last_post){
                    time_post = last_post.day_post
                }else{
                    time_post = 0
                }
                if(d1 - time_post >= 600){
                    let check_exits = await PostFindTutor.findOne({ugs_id : idGiaSu,as_id: as_id ,as_detail :as_detail, ct_id: ct_id, city_detail: city_detail }).lean()
                    if(!check_exits){
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


                        return functions.success(res, "lấy thành công", {check_exits})
                    }
                    return functions.setError(res , "Tin chưa có môn học, lớp và quận huyện.")
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