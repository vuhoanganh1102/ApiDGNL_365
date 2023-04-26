import {Schema, model} from "mongoose";

export default interface ICategory {
    name: string,
    title: string,
    tags: string,
    description: string,
    moTa: string,
    parentID: string,
    lq: string,
    count: number,
    countVl: number,
    order: number,
    active: number,
    hot: number,
    ut: number,
    only: number,
    except: string,
    tlq: string,
    tlqUV: string,
    nameNew: string
}

const categorySchema = new Schema<ICategory>({
    name: String,
    title: String,
    tags: String,
    description: String,
    moTa: {
        type: String,
        required: true
    },
    parentID: String,
    lq: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    countVl: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Number,
        default: 1
    },
    hot: {
        type: Number,
        default: 0
    },
    ut: {
        type: Number,
        required: true
    },
    only: {
        type: Number,
        required: true,
        default: 0
    },
    except: {
        type: String,
        required: true
    },
    tlq: {
        type: String,
        required: true
    },
    tlqUV: {
        type: String,
        required: true
    },
    nameNew: {
        type: String,
        required: true
    }
})
const Category = model('category', categorySchema);


export {Category};
