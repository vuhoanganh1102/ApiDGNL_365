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
        $project: { quantity: 1, unit: 1, status: 1, new: { _id: 1, title: 1, linkTitle: 1, img: 1, timePromotionStart: 1, timePromotionEnd: 1, baohanh: 1 }, user: { userName: 1, type: 1 } }
      }
    ])
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
    let { newsId, quantity, type, status, totalMoney } = req.body;
    if (!newsId || !quantity) {
      return functions.setError(res, "Missing input value!", 404);
    }
    let time = Date.now();
    let quantityUpdate = quantity;
    let cart = await Cart.findOne({ userId: userId, newsId: newsId, type: type, status: status });
    if (cart) {
      quantityUpdate = Number(cart.quantity) + Number(quantity);
      await Cart.findOneAndUpdate({ _id: cart._id }, {
        quantity: quantityUpdate, type, totalMoney, date: time
      });
      return functions.success(res, 'Add cart RN365 success!');
    }
    let newIdCart = await functions.getMaxIdByField(Cart, '_id');
    let fields = { _id: newIdCart, userId: userId, newsId: newsId, quantity: quantity, type: type, date: time };
    if (status == 0) {
      fields.total = totalMoney;
      await Cart.deleteMany({ userId: userId, status: 0 });
    }
    cart = new Cart(fields);
    await cart.save();
    return functions.success(res, 'Add cart RN365 success!');
  } catch (e) {
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