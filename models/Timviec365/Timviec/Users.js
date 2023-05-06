const mongoose = require('mongoose');
const Schema = mongoose.Schema
const UserSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        email: String,
        phoneTK:String,
        userName: String,
        alias: {
            type: String,
            default: null
        },
        phone:{
            type: String,
            default: null
        },
        emailContact:{
            type: String,
            default: null
        },
        avatarUser: {
            type: String,
            default: null
        },
        type: Number,
        password: String,
        city: Number,
        district: Number,
        address: String,
        otp: {
            type: String,
            default: null
        },
        authentic: {
            type:Number,
            default:0
        },
        isOnline: {
            type: Number,
            default: 0
        },
        from: String,
        createdAt: {
            type: Date
        },
        updatedAt: {
            type: Date,
            default: null
        },
        lastActivedAt:{
            type: Date,
            default: null
        },
        time_login: {
            type: Date,
            default: null
        },
        role: {
            type: Number,
            default: 0
        },
        latitude: {
            type: String,
            default: null
        },
        longtitude: {
            type: String,
            default: null
        },
        idQLC: {
            type: Number,
            default: 0
        },
        idTimViec365: {
            type: Number,
            default: 0
        },
        idRaoNhanh365:{
            type: Number,
            default: 0
        },
        chat365_secret: {
            type: String,
            default: null
        },
        inForEmployee: {
            type: {
                companyID: Number,
                depID: Number,
                groupID: Number,
                positionID: Number,
                startWorkingTime: Date,
                timeQuitJob: Date,
                description: String,
                status: String,
                ep_signature: Number,
                allow_update_face: Number,
                version_in_use: Number,
                ep_featured_recognition: String,
                birthday: Date,
                gender: Number,
                married: Number,
                exp: Number
            }, default: null
        },
        inForCompanyCC: {
            type: {
                user_id: Number,
                type_timekeeping: String,
                id_way_timekeeping: String,
                com_role_id: Number,
                com_size: Number,
                com_description: String,
                enable_scan_qr: Number,
                com_vip: Number,
                com_ep_vip: Number
            }, default: null
        },
        inForCandidateTV365: {
            type: {
                candiTitle: {
                    type: Number,
                    default: 0
                },
                candiHocVan: {
                    type: Number,
                    default: 0
                },
                candiExp: {
                    type: Number,
                    default: 0
                },
                candiMucTieu: {
                    type: String,
                    default: null
                },
                candiCityID:{
                    type: String,
                    default: null
                },
                candiCateID: {
                    type: String,
                    default: null
                },
                candiCapBac:{
                    type: Number,
                    default: 0
                },
                candiMoney:{
                    type: Number,
                    default: 0
                },
                candiLoaiHinh:{
                    type: Number,
                    default: 0
                },
                referencePersonName: {
                    type: String,
                    default: null
                },
                referencePersonEmail: {
                    type: String,
                    default: null
                },
                referencePersonPhone: {
                    type: String,
                    default: null
                },
                referencePersonPosition: {
                    type: String,
                    default: null
                },
                referencePersonAddress: {
                    type: String,
                    default: null
                },
                referencePersonCompany: {
                    type: String,
                    default: null
                },
                video:  {
                    type: String,
                    default: null
                },
                videoType: {
                    type: Number,
                    default: 0
                },
                videoActive: {
                    type: Number,
                    default: 0
                },
            }, default: null
        },
        inForCompanyTV365: {
            type: {
                userID: Number,
                comMd5: String,
                comViewCount: Number,
                idKD: Number,
                canonical: String,
                linkVideo: Number,
                videoType: Number,
                VideoActive: Number,
                comImages: String,
                website: String,
                mst: String,
                ipAddressRegister: String,
                userContactName: String,
                userContactAddress: String,
                userContactPhone: String,
                userContactEmail: String,
                description:String,
            }, default: null
        }
    },
    { collection: 'Users',  
    versionKey: false , 
    timestamp:true
  }  
    )
    
module.exports = mongoose.model("Users", UserSchema);
