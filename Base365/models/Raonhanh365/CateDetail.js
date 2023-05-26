const mongoose = require('mongoose');
const CateDetailSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        default: null,
    },
    productGroup: {
        type: [{
            _id: Number,
            name: String,
        }],
        default: null,
    },
    productShape: {
        // nhóm sản phẩm có hình dạng
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
        }],
        default: null,
    },
    productQuality: {
        // nhóm sản phẩm có chất lượng
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
        }],
        default: null,
    },
    petPurebred: {
        // giống thú cưng
        type: {
            _id: {
                type: Number
            },
            name: {
                type: String
            }
        },
        default: null,
    },
    petInfo: {
        // thông tin thú cưng
        type: {
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            type: {
                // phân loại theo : 1.Độ tuổi 2.Kích cỡ 3.Giống( đực|| cái)
                type: Number
            }
        },
        default: null,
    },
    origin: {
        // xuất xứ
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
        }],
        default: null,
    },
    capacity: {
        //dung lượng
        type: [{
            _id: {
                type: String
            },
            name: {
                type: String
            },
            type: {
                // phân loại: 1. Ram 2.Ổ cứng 3.Dung tích xe
                type: Number
            }
        }],
        default: null,
    },
    screen: {
        //màn hình
        type: [{
            _id: {
                type: Number,
            },
            name: {
                type: String,
            },
            type: {
                // phân loại: 1: card, 2: kích cỡ, 3: kích thước khung
                type: Number,
            }
        }],
        default: null,
    },
    warranty: {
        //bảo hành
        type: [{
            _id: {
                type: Number
            },
            warrantyTime: {
                //thời gian bảo hành
                type: String
            },
        }],
        default: null,
    },
    processor: {
        //bộ vi xử lý
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
        }],
        default: null,
    },
    yearManufacture: {
        //năm sản xuất
        type: [{
            _id: {
                type: Number
            },
            year: {
                type: String
            },
        }],
        default: null,
    },
    colors: {
        // màu sắc 
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
        }],
        default: null,
    },
    brand: {
        //hãng của sp
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            line: [{

                // dòng sp
                type: [{
                    _id: {
                        type: Number
                    },
                    name: {
                        type: String
                    },
                }],
                default: null,

            }]
        }],
        default: null,
    },
    storyAndRoom: {
        // số tầng, phòng của nhà
        type: [{
            _id: {
                type: Number
            },
            quantity: {
                //số lượng
                type: Number
            },
            type: {
                // loại: 1.tầng 2.Phòng ngủ 3.Nhà vệ sinh
                type: Number
            },
        }],
        default: null,
    },
    sport: {
        // môn thể thao
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            type: {
                //phân loại
                type: String
            }
        }],
        default: null,
    },
    loai_chung: {
        // chưa hiểu...
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            }
        }],
        default: null,
    },




}, {
    collection: 'CateDetailRn',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('CateDetailRn', CateDetailSchema);