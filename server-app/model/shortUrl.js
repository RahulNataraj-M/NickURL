import mongoose from "mongoose";
import {nanoid} from "nanoid";

const shortUrlSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        trim:true
    },
    fullUrl:{
        type:String,
        required:true
    },
    shortUrl:{
        type:String,
        required:true,
        default:()=>nanoid().substring(0,10),
    },
    clicks:{
        type:Number,
        default:0
    }
},{
    timestamps:true
}
);

shortUrlSchema.index({ userId: 1, fullUrl: 1 }, { unique: true });

export const urlModel = mongoose.model("ShortUrl", shortUrlSchema, "shorturls");
