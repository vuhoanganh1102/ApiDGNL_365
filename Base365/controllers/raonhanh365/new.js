const functions = require('../../services/functions');

// đăng tin
exports.postNewMain = async(req, res, next) => {
    try {
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
        if (cateID && title && name && email && address &&
            phone && detailCategory && district) {
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
            next()
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
        return functions.setError(res, '4 ', 404)
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}