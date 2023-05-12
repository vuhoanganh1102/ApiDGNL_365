const mongoose = require('mongoose');
const Schema = mongoose.Schema
const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneTK: {
        type: String,
        default: null,
    },
    userName: {
        type: String,
        required: true,
    },
    alias: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    emailContact: {
        type: String,
        default: null
    },
    avatarUser: {
        type: String,
        default: null
    },
    type: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    city: {
        type: Number,
        default: null,
    },
    district: {
        type: Number,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    otp: {
        type: String,
        default: null
    },
    authentic: {
        type: Number,
        default: 0
    },
    isOnline: {
        type: Number,
        default: 0
    },
    from: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        default: null
    },
    lastActivedAt: {
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
    idRaoNhanh365: {
        type: Number,
        default: 0
    },
    chat365_secret: {
        type: String,
        default: null
    },
    inForEmployee: {
        type: {
            companyID: {
                type: Number,
                default: 0
            },
            depID: {
                type: Number,
                default: 0
            },
            groupID: {
                type: Number,
                default: 0
            },
            positionID: {
                type: Number,
                default: 0
            },
            startWorkingTime: {
                type: String,
                default: null
            },
            timeQuitJob: {
                type: String,
                default: null
            },
            description: {
                type: String,
                default: null
            },
            status: {
                type: String,
                default: null
            },
            ep_signature: {
                type: Number,
                default: 0
            },
            allow_update_face: {
                type: Number,
                default: 0
            },
            version_in_use: {
                type: Number,
                default: 0
            },
            ep_featured_recognition: {
                type: String,
                default: null
            },
            birthday: {
                type: String,
                default: null
            },
            gender: {
                type: Number,
                default: 0
            },
            married: {
                type: Number,
                default: 0
            },
            exp: {
                type: Number,
                default: 0
            },
        },
        default: null
    },
    inForCompanyCC: {
        type: {
            type_timekeeping: {
                type: String,
                default: null
            },
            id_way_timekeeping: {
                type: String,
                default: null
            },
            com_role_id: {
                type: Number,
                default: 0
            },
            com_size: {
                type: Number,
                default: 0
            },
            com_description: {
                type: String,
                default: null
            },
            enable_scan_qr: {
                type: Number,
                default: 0
            },
            com_vip: {
                type: Number,
                default: 0
            },
            com_ep_vip: {
                type: Number,
                default: 0
            },
        },
        default: null
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
            candiCityID: {
                type: String,
                default: null
            },
            candiCateID: {
                type: String,
                default: null
            },
            candiCapBac: {
                type: Number,
                default: 0
            },
            candiMoney: {
                type: Number,
                default: 0
            },
            candiLoaiHinh: {
                type: Number,
                default: 0
            },
            candiSchool: {
                type: String,
                default: null
            },
            candiSkills: {
                type: String,
                default: null
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
            video: {
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
            cv: {
                type: String,
                default: null
            }
        },
        default: null
    },
    inForCompanyTV365: {
        type: {
            comMd5: String,
            comViewCount: {
                type: Number,
                default: 0
            },
            idKD: {
                type: Number,
                default: 0
            },
            canonical: String,
            linkVideo: {
                type: Number,
                default: 0
            },
            videoType: {
                type: Number,
                default: 0
            },
            VideoActive: {
                type: Number,
                default: 0
            },
            comImages: {
                type: String,
                default: null
            },
            website: {
                type: String,
                default: null
            },
            mst: {
                type: String,
                default: null
            },
            ipAddressRegister: {
                type: String,
                default: null
            },
            userContactName: {
                type: String,
                default: null
            },
            userContactAddress: {
                type: String,
                default: null
            },
            userContactPhone: {
                type: String,
                default: null
            },
            userContactEmail: {
                type: String,
                default: null
            },
            description: {
                type: String,
                default: null
            },
        },
        default: null
    }
}, {
    collection: 'Users',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("Users", UserSchema);