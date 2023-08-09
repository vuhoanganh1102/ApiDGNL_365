const functions = require('../../services/functions');
const Cart = require('../../models/Raonhanh365/Cart');
const News = require('../../models/Raonhanh365/New');

exports.getListCartByUserId = async (req, res, next) => {
  try {
    let userId = req.user.data.idRaoNhanh365;
    let page = Number(req.body.page) || 1;
    let pageSize = Number(req.body.pageSize) || 10;

    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    let data = await Cart.aggregate([
      { $match: { userId } },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'Users',
          localField: 'userId',
          foreignField: 'idRaoNhanh365',
          as: 'user'
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'RN365_News',
          localField: 'newsId',
          foreignField: '_id',
          as: 'new'
        }
      },
      { $unwind: { path: "$new", preserveNullAndEmptyArrays: true } },
      {
        $project: { quantity: 1, unit: 1, status: 1, new: { _id: 1, title: 1, userID: 1, linkTitle: 1, cateID: 1, img: 1, money: 1, timePromotionStart: 1, timePromotionEnd: 1, baohanh: 1, buySell: 1, infoSell: 1 }, user: { _id: 1, userName: 1, type: 1 } }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      if (data[i].new.img) {
        data[i].new.img = await raoNhanh.getLinkFile(data[i].new.userID, data[i].new.img, data[i].new.cateID, data[i].new.buySell)

      }
    }
    let soluong = data.length;
    return functions.success(res, "get list cart success", { soluong, data });
  } catch (e) {
    console.log("Err from server", e);
    return functions.setError(res, "Err from server", 500);
  }
}

//admin them tin vao cart
exports.addCart = async (req, res, next) => {
  try {
    let userId = req.user.data.idRaoNhanh365;
    let idnew = Number(req.body.id);
    let soluong = Number(req.body.soluong);
    let phanloai = req.body.phanloai;
    // trang thai = 1: vao gio hang;  0: mua ngay dat coc
    let trangthai = Number(req.body.trangthai);
    let tongtien = Number(req.body.tongtien);
    let ngaydathang = new Date();

    if (idnew && soluong && phanloai) {
      if (
        functions.checkNumber(soluong) && functions.checkNumber(tongtien) &&
        functions.checkNumber(trangthai) && soluong > 0 && tongtien > 0) {

        let checkGh = await Cart.findOne({ userId, newsId: idnew, type: phanloai, status: trangthai }).lean();
        if (checkGh) {
          await Cart.findByIdAndUpdate(checkGh._id, { $inc: { quantity: +soluong, total: +tongtien }, date: ngaydathang })
        } else {
          if (trangthai === 0) {
            await Cart.deleteOne({ userId, trangthai: 0 });
            let id = await functions.getMaxID(Cart) + 1 || 1;
            await Cart.create({
              _id: id,
              date: ngaydathang,
              userId,
              newsId: idnew,
              type: phanloai,
              quantity: soluong,
              total: tongtien,
              status: trangthai,
            })
          } else if (trangthai === 1) {
            let id = await functions.getMaxID(Cart) + 1 || 1;
            await Cart.create({
              _id: id,
              date: ngaydathang,
              userId,
              newsId: idnew,
              type: phanloai,
              quantity: soluong,
              status: trangthai,
            })
          }
        }
        return functions.success(res, 'thành công')
      }
      return functions.setError(res, 'invalid number', 400)
    }

    return functions.setError(res, 'missing data', 400)
  } catch (e) {
    console.log("🚀 ~ file: cart.js:100 ~ exports.addCart= ~ e:", e)
    return functions.setError(res, e.message);
  }
}

exports.removeCart = async (req, res, next) => {
  try {

    let idCart = Number(req.body.idCart);
    if (idCart) {
      let cart = await functions.getDataDeleteOne(Cart, { _id: idCart });
      if (cart.deletedCount === 1) {
        return functions.success(res, `Remove new from cart with _id=${idCart} success`);
      } else {
        return functions.success(res, "Cart not found");
      }
    }
    return functions.setError(res, "Missing input idCart", 505);
  } catch (e) {
    console.log("Error from server", e);
    return functions.setError(res, "Error from server", 500);
  }
}

// thay đổi số lượng trong giỏ hàng
exports.changeCart = async (req, res, next) => {
  try {
    let userId = req.user.data.idRaoNhanh365;
    let request = req.body;
    let _id = Number(request.id);
    let soluong = Number(request.soluong);
    if (_id && soluong) {
      if (functions.checkNumber(soluong)) {
        let check = await Cart.findOne({ _id, userId }).lean();
        if (check) {
          if (soluong < 0 && check.quantity + soluong > 0) {
            await Cart.findByIdAndUpdate(_id, {
              $inc: { quantity: +soluong }
            });
          }
          if (soluong > 0) {
            await Cart.findByIdAndUpdate(_id, {
              $inc: { quantity: +soluong }
            });
          }
          if (soluong < 0 && check.quantity + soluong == 0) {
            await Cart.findByIdAndDelete(_id);
          }
          if (soluong < 0 && check.quantity + soluong < 0) {
            return functions.setError(res, 'Số lượng muốn xoá lớn hơn số lượng trong giỏ hàng', 400)
          }
          return functions.success(res, 'cập nhật giỏ hàng thành công')
        }
        return functions.setError(res, 'not found cart', 404)
      }
      return functions.setError(res, 'invalid soluong', 400)
    }
    return functions.setError(res, 'missing data', 400)
  } catch (error) {
    return functions.setError(res, error.message)
  }
}