const mongoose = require('mongoose')
const ManageTracking = new mongoose.Schema({
   
   
    _id:{
        type : Number ,
        require : true
    },
    companyId: {
        type: Number,
    },


    TrackingByApp : [
        {   
            name: "TrackingAppTV365",
            checkedValue : Boolean
         },
         {    
            name: "QRTrackingAppChat365",
            checkedValue : Boolean
         },
         {    
            name: "FaceTrackingAppChat365",
            checkedValue : Boolean
         },
         {    
            name: "QRTrackingAppPC365",
            checkedValue : Boolean
         },
         {    
            name: "TrackingAppPC365",
            checkedValue : Boolean
         },
    ],
    TrackingByWeb : [
        {   
            name: "TrackingWebStaff",
            checkedValue : Boolean
         },
        {   
            name: "TrackingWebCompany",
            checkedValue : Boolean
         },
    ],
    QRTracking : [
        {   
            name: "QRTracking",
            checkedValue : Boolean
         },
    ]
}

)
 
module.exports = mongoose.model('ManageTracking',ManageTrackingSchema)