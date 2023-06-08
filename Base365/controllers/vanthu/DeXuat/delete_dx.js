
const De_Xuat = require('../../../models/Vanthu/de_xuat');
exports.delete_dx = async (req, res) => {
    let id = req.params.id;
    console.log("id la :  " + id)
    if (!isNaN(id)) {

        const de_xuat = await De_Xuat.findOne({ _id: id });

        if (!de_xuat) {
            return res.status(200).json("de xuat khong ton tai");
        } else {

            await De_Xuat.deleteOne({ _id: id });

            return res.status(200).json("da xoa");
        }
    } else {
        return res.status(404).json("id phai la 1 so Number");
    }


}