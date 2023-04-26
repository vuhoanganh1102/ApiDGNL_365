import {Schema, model} from "mongoose";

export default interface ISaveCandidate {
    uscID: number,
    userID: number,
    saveTime: Date,
}
const saveCandidateSchema = new Schema<ISaveCandidate>({
    uscID: {
        type: Number,
        required: true
    },
    userID: {
        type: Number,
        default: 0
    },
    saveTime: {
        type: Date,
        required: true
    }
})
const SaveCandidate = model('SaveCandidate', saveCandidateSchema);


export {SaveCandidate};
