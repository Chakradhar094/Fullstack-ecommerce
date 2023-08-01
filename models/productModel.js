import mongoose  from "mongoose";

const productSChema=new mongoose.Schema({
    name:{
        type:String,
        lowercase: true,
        required:true
    },
    slug:{
        type:String,
        lowercase: true,
        required:true
    },
    description:{
        type:String,
        lowercase: true,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:"category",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    photo:{
        data:Buffer,
        conTentType:String
    },
    shipping:{
        type:Boolean
    }


},{timestamps:true})

export default mongoose.model("products",productSChema)