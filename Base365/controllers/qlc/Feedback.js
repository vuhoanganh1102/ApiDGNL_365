const feedback = require("../../models/qlc/Feedback")
const feedback_emp = require("../../models/qlc/Feedback_emp")
const functions = require('../../services/functions')


exports.create = async(req, res) => {
try{
    let idQLC = req.user.data.idQLC
    let { rating, feed_back, app_name, from_source, type } = req.body
    let createdAt = new Date()
    if (idQLC && type && rating && feed_back) {
        const max = await feedback.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean()||0
        
        let fb = new feedback({
            id: Number(max.id) + 1 || 1,
            id_user: idQLC,
            type_user: type,
            feed_back: feed_back,
            rating: rating,
            create_date: Date.parse(createdAt),
            app_name: app_name,
            from_source: from_source,
            
        })
        await fb.save()
        return functions.success(res, 'lấy thành công', { fb })
    }
    return functions.setError(res, "lost info")
}catch(e){
    return functions.setError(res, e.message)
}
    
}
exports.createFeedEmp = async(req, res) => {
    try {
        let { cus_id, cus_name , rating, feed_back, app_name, from_source, email, phone_number } = req.body
        let createdAt = new Date()
        if (rating && feed_back) {
            let max = await feedback_emp.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean()|| 0;
            let feedbacks = new feedback_emp({
                id: Number(max.id) + 1 || 1,
                cus_id: cus_id,
                cus_name : cus_name,
                email: email,
                phone_number: phone_number,
                feed_back: feed_back,
                rating: rating,
                create_date: Date.parse(createdAt),
                app_name: app_name ,
                from_source: from_source,
            })
            await feedbacks.save()
            return functions.success(res, 'lấy thành công', {feedbacks})
        }
        return functions.setError(res, "thiếu thông tin")
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message)
    }
}