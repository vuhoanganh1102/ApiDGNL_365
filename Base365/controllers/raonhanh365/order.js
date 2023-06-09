const functions = require('../../services/functions');
const New = require('../../models/Raonhanh365/UserOnSite/New');
const User = require('../../models/Users');
const Order = require('../../models/Raonhanh365/Order');
const Bidding = require('../../models/Raonhanh365/Bidding');
const raoNhanh = require('../../services/rao nhanh/raoNhanh')
// đặt hàng
exports.order = async (req, res, next) => {
    try {
        let { id_new, paymentMethod, quantity, unitPrice, promotionType, promotionValue, paymentType
            , totalProductCost, amountPaid } = req.body;
        let sellerId = null;
        let deliveryAddress = req.body.deliveryAddress || null;
        let classify = req.body.classify || null;
        let note = req.body.note || null;
        let userID = req.user.data;
        let status = 0;
        let codeOrder = functions.getRandomInt(100000, 999999);
        let name = req.body.name || null;
        let phone = req.body.phone || null;
        if (amountPaid && id_new && paymentMethod && quantity && unitPrice && promotionType && promotionValue && paymentType && totalProductCost) {
            if (await functions.checkNumber(paymentMethod)
                && await functions.checkNumber(quantity)
                && await functions.checkNumber(unitPrice)
                && await functions.checkNumber(promotionType)
                && await functions.checkNumber(promotionValue)
                && await functions.checkNumber(paymentType)
                && await functions.checkNumber(totalProductCost)
                && await functions.checkNumber(amountPaid)) {
                if(quantity <= 0)
                {
                    return functions.setError(res,'Nhập số lượng lớn hơn 0',400)
                }
                if (paymentMethod === 0)
                    await User.findByIdAndUpdate(userID, { $inc: { money: -amountPaid } });
                let check = await New.findById(id_new);
                if (check && check.length !== 0) {
                    sellerId = check.userID
                }
                if (!sellerId) return functions.setError(res, 'Tin bán không tồn tại', 404)
                let _id = await functions.getMaxID(Order) + 1 || 1;
                await Order.create({ _id, newId: id_new, sellerId, name, phone, paymentMethod, buyerId: userID, status, codeOrder, deliveryAddress, note, classify, quantity, unitPrice, promotionType, promotionValue, paymentType, totalProductCost })
            } else {
                return functions.setError(res, 'invalid data', 404)
            }
        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, 'order success')
    } catch (error) {
        return functions.setError(res, error)
    }
}
// Đấu thầu
exports.bidding = async (req, res, next) => {
    try {
        let { newId, productName, productDesc, price, priceUnit } = req.body;
        let userID = req.user.data._id;
        let product_link = req.body.product_link || null;
        let user_intro = req.body.user_intro || null;
        let uploadfile = req.files;
        let userFile = null;
        let userProfile = req.body.userProfile || null;
        let userProfileFile = null;
        let promotion = req.body.promotion || null;
        let promotionFile = null;
        let _id = await functions.getMaxID(Bidding) + 1;
        let status = 0;
        if (await functions.checkNumber(price) === false) {
            return functions.setError(res, 'invalid price', 400)
        }
        let check = await Bidding.find({ userID, newId })
        if (check.length) {
            return functions.setError(res, 'chỉ đấu thầu 1 lần với 1 tin', 400)
        }
        if (uploadfile.userFile) {
            if (uploadfile.userFile.length) return functions.setError(res, 'Tải lên quá nhiều file', 400)
            raoNhanh.uploadFileRaoNhanh('avt_dthau', userID, uploadfile.userFile, ['.jpg', '.png', '.docx', '.pdf'])
            userFile = functions.createLinkFileRaonhanh('avt_dthau', userID, uploadfile.userFile.name)
        } else if (uploadfile.userProfileFile) {
            if (uploadfile.userProfileFile.length) return functions.setError(res, 'Tải lên quá nhiều file', 400)
            raoNhanh.uploadFileRaoNhanh('avt_dthau', userID, uploadfile.userProfileFile, ['.jpg', '.png', '.docx', '.pdf'])
            userProfileFile = functions.createLinkFileRaonhanh('avt_dthau', userID, uploadfile.userProfileFile.name)
        } else if (uploadfile.promotionFile) {
            if (uploadfile.promotionFile.length) return functions.setError(res, 'Tải lên quá nhiều file', 400)
            raoNhanh.uploadFileRaoNhanh('avt_dthau', userID, uploadfile.promotionFile, ['.jpg', '.png', '.docx', '.pdf'])
            promotionFile = functions.createLinkFileRaonhanh('avt_dthau', userID, uploadfile.promotionFile.name)
        }
        await Bidding.create({ _id, newId, userID, productName, productDesc, status, price, priceUnit, product_link, user_intro, userFile, userProfile, userProfileFile, promotion, promotionFile })
        return functions.success(res, 'bidding success')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// api thông báo kết quả đấu thầu
exports.announceResult = async (req, res, next) => {
    try {
        let { status, id_dauthau } = req.body;
        if (!status || !id_dauthau) {
            return functions.setError(res, 'missing data', 400);
        }
        if (await functions.checkNumber(status) === false || await functions.checkNumber(id_dauthau) === false) {
            return functions.setError(res, 'invalid number', 400);
        }
        let data = await Bidding.findById(id_dauthau);
        if (!data) {
            return functions.setError(res, 'not exits', 400);
        }
        if (data.updatedAt) {
            return functions.setError(res, 'Chỉ được cập nhật 1 lần', 400);
        }
        let updatedAt = new Date(Date.now())
        await Bidding.findByIdAndUpdate(id_dauthau, { status, updatedAt })
        return functions.success(res, 'Thông báo thành công')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// quản lý đơn hàng mua
exports.manageOrderBuy = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        let buyerId = req.user.data._id;
        let data = [];
        let sl_choXacNhan = await Order.find({ buyerId, status: 0 }).count();
        let sl_dangXuLy = await Order.find({ buyerId, status: 1 }).count();
        let sl_dangGiao = await Order.find({ buyerId, status: 2 }).count();
        let sl_daGiao = await Order.find({ buyerId, status: 3 }).count();
        let sl_daHuy = await Order.find({ buyerId, status: 4 }).count();
        let sl_hoanTat = await Order.find({ buyerId, status: 5 }).count();
        if (linkTitle === 'quan-ly-don-hang-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId,"Order.status": 0 }
                },
                 {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-xu-ly-nguoi-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId,status: 1 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else if (linkTitle === 'quan-ly-don-hang-dang-giao-nguoi-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId,status: 2 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else if (linkTitle === 'quan-ly-don-hang-da-giao-nguoi-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId,status: 3 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else if (linkTitle === 'quan-ly-don-hang-da-huy-nguoi-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId,status: 4 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else if (linkTitle === 'quan-ly-don-hang-hoan-tat-nguoi-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId,status: 5 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else{
            return functions.setError(res,'link not exits',404)
        }
        return functions.success(res, 'get data success', {sl_choXacNhan,sl_dangXuLy,sl_dangGiao,sl_daGiao,sl_daHuy,sl_hoanTat,data })
    } catch (error) {
        return functions.setError(res, error)
    }
}

// quản lý đơn hàng mua
exports.manageOrderSell = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        let sellerId = req.user.data._id;
        let data = [];
        let sl_choXacNhan = await Order.find({ sellerId, status: 0 }).count();
        let sl_dangXuLy = await Order.find({ sellerId, status: 1 }).count();
        let sl_dangGiao = await Order.find({ sellerId, status: 2 }).count();
        let sl_daGiao = await Order.find({ sellerId, status: 3 }).count();
        let sl_daHuy = await Order.find({ sellerId, status: 4 }).count();
        let sl_hoanTat = await Order.find({ sellerId, status: 5 }).count();
        if (linkTitle === 'quan-ly-don-hang-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId,"Order.status": 0 }
                },
                 {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-xu-ly-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId,status: 1 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else if (linkTitle === 'quan-ly-don-hang-dang-giao-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId,status: 2 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else if (linkTitle === 'quan-ly-don-hang-da-giao-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId,status: 3 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else if (linkTitle === 'quan-ly-don-hang-da-huy-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId,status: 4 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else if (linkTitle === 'quan-ly-don-hang-hoan-tat-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId,status: 5 }
                }, {
                    $project: { title: 1, Order: {status:1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        }else{
            return functions.setError(res,'link not exits',404)
        }
        return functions.success(res, 'get data success', {sl_choXacNhan,sl_dangXuLy,sl_dangGiao,sl_daGiao,sl_daHuy,sl_hoanTat,data })
    } catch (error) {
        return functions.setError(res, error)
    }
}
