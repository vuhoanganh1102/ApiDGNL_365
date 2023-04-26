import {Schema, model} from "mongoose";

export default interface ISavePost {
    userID: number,
    newID: number,
    saveTime: Date,
}
const savePostSchema = new Schema<ISavePost>({
    userID: {
        type: Number,
        required: true
    },
    newID: {
        type: Number,
        default: 0
    },
    saveTime: {
        type: Date,
        required: true
    }
})
const SavePost = model('SavePost', savePostSchema);


export {SavePost};
