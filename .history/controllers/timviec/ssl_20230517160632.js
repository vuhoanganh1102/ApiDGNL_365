const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương
exports.findByCondition = async(req, res, next) => {
    try {
        const cityID = req.query.cityID || 1;
        const nganh = req.query.nganh;

        const a = await newTV365.aggregate([{
                $group: {
                    _id: null,
                    maxSalary: { $max: '$maxValue' },
                    minSalary: { $min: '$maxValue' },
                    avgSalary: { $avg: '$maxValue' },
                },
            },
            {
                $project: {
                    _id: 0,
                    maxSalary: 1,
                    minSalary: 1,
                    avgSalary: 1,
                },
            },
        ])
        console.log(a)

        const data = await newTV365.find(cityID, nganh, { 'newMoney.unit': 1 }, { $or: query });
        console.log(data);
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};