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
    ProductQuality: {
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
    petInfo: {
        // thông tin thú cưng
        type: {

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
        type: {

        },
        default: null,
    },
    screen: {
        //màn hình
        type: {

        },
        default: null,
    },
    warranty: {
        //bảo hành
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
            name: {
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
    story: {
        // số tầng của nhà
        type: [{
            _id: {
                type: Number
            },
            quantity: {
                type: Number
            },
            room: [{
                // số phòng
                _id: {
                    type: Number
                },
                description: {
                    type: String
                },

            }]
        }],
        default: null,
    }

}, {
    collection: 'CateDetail',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('Category', CateDetailSchema);