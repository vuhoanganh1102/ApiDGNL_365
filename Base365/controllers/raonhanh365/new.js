const functions = require('../../services/functions');

// đăng tin
exports.postNewMain = async(req, res, next) => {
    try {
        let img = req.files.img;
        let video = req.files.video;
        let request = req.body,
            cateID = request.cate_id,
            title = request.title,
            money = request.money,
            until = request.until,
            description = request.description,
            free = request.free,
            poster = request.poster,
            name = request.name,
            email = request.email,
            address = request.address,
            phone = request.phone,
            detailCategory = request.detailCategory,
            district = request.district;
        if (money) {
            req.info = {
                cateID: cateID,
                title: title,
                money: money,
                until: until,
                description: description,
                free: free,
                poster: poster,
                name: name,
                email: email,
                address: address,
                phone: phone,
                detailCategory: detailCategory,
                district: district
            }
            return next()
        }
        return functions.setError(res, 'Thiếu dữ liệu ', 404)
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin
exports.postNewElectron = async(req, res, next) => {
    try {
        console.log(req.info)
        return functions.setError(res, 'T41 ', 404)
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}