import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authhelper.js";
import  JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
export const registerController=async(req,res)=>{

    try {
        const {name,email,answer,password,phone,address}=req.body;
    
        if(!name){
            return res.send({
                message:'Name is required'
            })
        }
        if(!email){
            return res.send({
                message:'email is required'
            })
        }
        if(!answer){
            return res.send({
                message:'Answer is required'
            })
        }
        if(!password){
            return res.send({
                message:'password is required'
            })
        }
       
        if(!phone){
            return res.send({
                message:'phone is required'
            })
        }
        if(!address){
            return res.send({
                message:'Address is required'
            })
        }

        //existing user

        const existinguser=await userModel.findOne({email});

        if(existinguser){
            return res.status(200).send({
                success:true,
                message:'Already registered please login'
                       })
        }
        const hashedPassword=await hashPassword(password);

        const user=await new userModel({name,email,phone,answer,address,password:hashedPassword}).save();

        res.status(201).send({
            success:true,
            message:"User Register Succesfully",
            user 
        })
    } catch (error) {
        console.log(error);

        res.status(500).send({
            success:false,
            message:'Error in registration',
            error
        })
    }

}

export const loginController=async(req,res)=>{
    try {
         const {email,password}=req.body;

         if(!email||!password){
            return res.status(200).send({
                success:false,
                message:'Invalid email or password'
            })
         }
         //check user
         const user=await userModel.findOne({email});
         if(!user){
           return res.status(200).send({
                success:false,
                message:'Email is not registered'
            })
         }


         const match=await comparePassword(password,user.password);

         if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid password'
            })
         }
         const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:'7d'
         })

         res.status(200).send({
            success:true,
            message:'Login successfull',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token
         })
    } catch (error) {
        console.log(error);

        res.status(500).send({
            success:false,
            message:'Error in Login',
            error
        })
    }
}
 export async function forgotPasswordController (req,res){
    try {
        const {email,answer,password}= req.body;

        if(!email){
           res.send(200).send({
               success:false,
               message:'Email is required'
           })
        }
        if(!answer){
           res.send(200).send({
               success:false,
               message:'Answer is required'
           })
        }
        if(!password){
           res.send(200).send({
               success:false,
               message:'Password is required'
           })
        }
        const user=await userModel.findOne({email,answer});
        if(user){
           const newhashpassword=await hashPassword(password);
           await userModel.findByIdAndUpdate(user._id,{password:newhashpassword})
        }else{
            res.status(200).send({
                success:false,
                message:"Invalid email or answer"
            })
        }
        res.status(200).send({
            success:true,
            message:"Password modified successfully"
        })
        
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,
            message:'Error in Registartion',
            error
        })
    }
       

       
}
export const testController=(req,res)=>{
        return  res.status(200).send('hi');
}

export const updateProfileController=async(req,res)=>{
    try {
        const {name,address,phone,password}=req.body;
        const user=await userModel.findById(req.user._id);
        if(password && password.length<6){
            return res.json({error:'Password is required and 6 chracter long'});
        }
        const hashedpass=password ? await hashPassword(password):undefined
        const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
            name:name||user.name,
            phone:phone||user.phone,
            address:address||user.address,
            password:hashedpass||user.password
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Profile updated successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,
            message:'Error in Updating profile',
            error
        })
    }
}


//orders

export const getOrderController=async(req,res)=>{
    try {
         const orders=await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
      
         res.status(200).send({
           
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,
            message:'Error in getting orders',
            error
        })
    }
}

export const getAllOrdersController=async(req,res)=>{
    try {
         const orders=await orderModel
         .find({})
         .populate("products","-photo")
         .populate("buyer","name")
         .sort({createdAt:"-1"});
         res.json(orders);
      
        
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,
            message:'Error in getting orders',
            error
        })
    }
}

export const updateOrderStatus=async(req,res)=>{
    try {
       
      const {orderId}=req.params;
      const {status}=req.body;
      const orders=await orderModel.findByIdAndUpdate(orderId,{status},{new:true});
      res.json(orders);
        
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,
            message:'Error in updating order status',
            error
        })
    }
}