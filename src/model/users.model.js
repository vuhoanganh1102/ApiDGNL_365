import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        email: String,
        phoneTK:Number,
        userName: String,
        alias: String,
        phone:Number,
        emailContact:String,
        avatarUser: String,
        type: Number,
        password: String,
        city: Number,
        district: Number,
        address: String,
        otp: String,
        authentic: Number,
        isOnline: Number,
        from: String,
        createdAt: Date,
        updatedAt: Date,
        lastActivedAt: Date,
        time_login: Date,
        role: Number,
        latitude: String,
        longtitude: String,
        idQLC: Number,
        idTimViec365: Number,
        idRaoNhanh365: Number,
        chat365_secret: String,
        inForEmployee: {
            type: {
                _id:{
                    type: Number,
                    required: true,
                },
                user_id: Number,
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
                _id:{
                    type: Number,
                    required: true,
                },
                userID: Number,
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
                _id:{
                    type: Number,
                    required: true,
                },
                user_id: Number,
                candiTitle: Number,
                candiHocVan: Number,
                candiExp: Number,
                candiMucTieu: String,
                candiCityID: String,
                candiCateID: String,
                candiCapBac: Number,
                candiMoney: Number,
                candiLoaiHinh: Number,
                referencePersonName: String,
                referencePersonEmail: String,
                referencePersonPhone: String,
                referencePersonPosition: String,
                referencePersonAddress: String,
                referencePersonCompany: String,
                video: String,
                videoType: Number,
                videoActive: Number
            }, default: null
        },
        inForCompanyTV365: {
            type: {
                _id:{
                    type: Number,
                    required: true,
                },
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
            }, default: null
        }
    })
