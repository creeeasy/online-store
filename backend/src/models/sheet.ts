import mongoose, { Schema, Types } from "mongoose";



export interface ISheet extends Document{
    _id: Types.ObjectId;
    sheetID?:string;
}

const sheetSchema=new Schema<ISheet>(
    {
        sheetID:{
            required:false,
            type:String
        }
    }
)

export default mongoose.model<ISheet>('Sheet', sheetSchema);