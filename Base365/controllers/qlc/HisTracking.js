const Tracking = require('../../models/qlc/HisTracking');
const functions = require('../../services/functions')

//thêm chấm công 
exports.CreateTracking = async (req,res)=>{
    const idQLC = req.body.idQLC;
    const companyId = req.body.CompanyId;
    const role = req.body.role;
    const imageTrack = req.body.imageTrack;
    const curDeviceName = req.body.curDeviceName;
    const latitude = req.body.latitude;
    const longtitude = req.body.longtitude;
    const Location = req.body.Location;
    const NameWifi = req.body.NameWifi;
    const IpWifi = req.body.IpWifi;
    const MacWifi = req.body.MacWifi;
    const shiftID = req.body.shiftID;
    const BluetoothAdrr = req.body.BluetoothAdrr;
    const Err = req.body.Err;
    const Success = req.body.Success;
    const Note = req.body.Note;


    if (!companyId) {
        functions.setError(res, "Company id required");
    }else if (typeof companyId !== "number") {
        functions.setError(res, "Company id must be a number");
    }else if (!idQLC) {
        functions.setError(res, "idQLC required");
    }else if (typeof idQLC !== "number") {
        functions.setError(res, "idQLC id must be a number");
    }else if (!imageTrack) {
        functions.setError(res, "imageTrack required");
    }else if (!curDeviceName) {
        functions.setError(res, "curDeviceName required");
    }else if (!latitude) {
        functions.setError(res, "latitude required");
    }else if (!longtitude) {
        functions.setError(res, "longtitude required");
    }else if (!Location) {
        functions.setError(res, "Location required");
    }else if (!NameWifi) {
        functions.setError(res, "Wifi name required");
    }else if (!IpWifi) {
        functions.setError(res, "Wifi ip required");
    }else if (!MacWifi) {
        functions.setError(res, "Mac Wifi required");
    }else if (!shiftID) {
        functions.setError(res, "Shift name required");
    }else {
        let maxId = await functions.getMaxID(Tracking);
        if (!maxId) {
            maxId = 0;
        }
        const _id =Number(maxId) + 1;
        const tracking = new Tracking({
            _id : _id,
            idQLC: idQLC,
            companyId: companyId,
            role: role,
            imageTrack: imageTrack,
            curDeviceName: curDeviceName,
            latitude: latitude ,
            longtitude: longtitude,
            Location: Location,
            NameWifi: NameWifi,
            IpWifi: IpWifi,
            MacWifi: MacWifi,
            shiftID: shiftID,
            BluetoothAdrr: BluetoothAdrr,
            Err: Err,
            Success: Success,
            Note: Note



        });
        await tracking.save()
            .then(()=>{
                functions.success(res,"Tracking successful",tracking)
            })
            .catch(err =>{
                functions.setError(res,err.message)
            })
    }
};