
const functions = require('../../services/functions')
const User = require('../../models/Users')


exports.updateTutor = async(req,res)=>{
    try{
    let {userName,gender,birthday,marital_status,ugs_tutor_style,ugs_class_teach,
        ugs_school,ugs_graduation_year,ugs_specialized,city,district,address,
        ugs_workplace,ugs_about_us,ugs_achievements,ugs_experience_year,
        ugs_title,ugs_year_start,ugs_year_end,ugs_job_description
    
    } = req.body
    let idGiaSu = ""
    // Kiểm tra chuỗi userName không chứa ký tự đặc biệt
    let pattern = /^[A-Za-z0-9 ]+$/; // Mẫu chỉ chứa ký tự chữ cái, số và khoảng trắng
    if (!pattern.test(userName)) {
        return functions.setError(res, 'userName không được chứa ký tự đặc biệt', 400);
    }
    if(!gender || !birthday || !marital_status || !ugs_tutor_style || !ugs_class_teach ||
        !city || !district || !address || !ugs_about_us || !ugs_experience_year){
        return functions.setError(res, 'userName không được chứa ký tự đặc biệt', 400);
    }
    if(req.user.data.type == 2 || req.user.data.type == 0){
    idGiaSu = req.user.data.idGiaSu
    let editGiaSu = await User.findOneAndUpdate({
        
    })
    }else{
        return functions.setError(res, 'không có quyền truy cập', 400);
    }
    }catch (e) {
        console.log(e);
        return functions.setError(res, e.message)
    }
}