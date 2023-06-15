const feedback = require("../../models/qlc/Feedback")
const functions = require('../../services/functions')


exports.create = async (req,res) =>{
    // let { } = req.body
    let{ idQLC, rating,feed_back,createdAt,app_name,from_source,type }= req.body
    if((idQLC&&type&&rating&&feed_back) == undefined){
        functions.setError(res ,"lost info")
    }else{
        const max = await feedback.findOne({},{_id : 1}).sort({_id : -1}).limit(1).lean()
        // const max1 = await functions.getMaxID(feedback)
        console.log(max)

        let feedbacks = new feedback({
            _id : Number(max) + 1 || 1,
            idQLC : idQLC ,
            type : type,
            feed_back :feed_back,
            rating: rating,
            createdAt : new Date(),
            app_name: app_name || null,
            from_source : from_source || null ,

        })
        await feedbacks.save()
        .then(()=>functions.success(res,'thanh cong', {feedbacks}))
        .catch((e)=>functions.setError(res, e.message))
    }
}