import  mongoose from 'mongoose'

const orderSchema=new mongoose.Schema({
    products:[{
        type:mongoose.ObjectId,
        ref:"products",
    }],
    payment:{},
    buyer:{
        type:mongoose.ObjectId,
        ref:'users'
    },
    status:{
        type:String,
        default:'Not process',
        enum:['Not process','processing','shipped','delivered','cancel']
    }

},{timestamps:true});

export default mongoose.model("order",orderSchema);