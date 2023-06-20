const functions = require('../../services/functions');
const Cart = require('../../models/Raonhanh365/Cart');
const News = require('../../models/Raonhanh365/New');

exports.getListCartByUserId = async(req, res, next) => {
    try {
        if (req.body) {
            let userId = req.body.userId,
            page = Number(req.body.page),
            pageSize = Number(req.body.pageSize);
            if(!userId || !page  || !pageSize){
              return functions.setError(res, "Missing input value", 403);
            }
            
            
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            
            const listCart = await functions.pageFind(Cart, {userId: userId}, { _id: 1 }, skip, limit);
            for(let i=0; i<listCart.length; i++){
              let news = await News.findOne({_id: listCart[i].newsId}, {title: 1, money:1, image: 1});
              listCart[i].title = news.title;
              listCart[i].money = news.money;
              listCart[i].image = news.image;

              if(!news){
                return functions.setError(res, "New not found", 501);
              }
            }
            return functions.success(res, "get list cart success", {data: listCart });
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

//admin them tin vao cart
exports.addCart = async(req, res, next) => {
    try {
        let {userId, newsId, quantity} = req.body;
        if(!userId || !newsId || !quantity){
          return functions.setError(res, "Missing input value!", 404);
        }

        let quantityUpdate = quantity;
        let cart = await Cart.findOne({userId: userId, newsId: newsId});
        if(cart){
          quantityUpdate = Number(cart.quantity) + Number(quantity);
          await Cart.findOneAndUpdate({userId: userId, newsId: newsId}, {
            quantity: quantityUpdate
          });
          return functions.success(res, 'Add cart RN365 success!');
        }

        const maxIdCart = await Cart.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIdCart;
        if (maxIdCart) {
            newIdCart = Number(maxIdCart._id) + 1;
        } else newIdCart = 1;
        
        cart = new Cart({
          _id: newIdCart,
          userId: userId,
          newsId: newsId,
          quantity: quantity
        });
        await cart.save();
        return functions.success(res, 'Add cart RN365 success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.removeCart = async(req, res, next) => {
    try {
      // xoa 1 tin trong gio hang
      let idCart = Number(req.query.idCart);
      if (idCart) {
          let cart = await functions.getDataDeleteOne(Cart ,{_id: idCart});
          if (cart.deletedCount===1) {
              return functions.success(res, `Remove new from cart with _id=${idCart} success`);
          }else{
              return functions.success(res, "Cart not found");
          }
      }
      return functions.setError(res, "Missing input idCart", 505);
    } catch (e) {
      console.log("Error from server", e);
      return functions.setError(res, "Error from server", 500);
    }
}