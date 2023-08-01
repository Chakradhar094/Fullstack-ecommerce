import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const categoryController=async(req,res)=>{
    try {

        const {name}=req.body
       
        if(!name){
            return  res.status(200).send({
                success:false,
    
                message:'Category name is required',
    
               
            })
        }

        const existtingCategory=await categoryModel.findOne({name:name});

        if(existtingCategory){
            return res.status(200).send({
                success:true,
    
                message:'Category already exists',
    
                
            })
        }

        const category=await new categoryModel({name,slug:slugify(name)}).save();

        res.status(200).send({
            success:true,

            message:'New category successfully created',

            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,

            message:'Error in creating category',

            error
        })
    }
}

export const updateCategoryController=async(req,res)=>{
         try {
            const {name}=req.body;

            const {id}=req.params
            console.log(req.body)

            const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});

            res.status(200).send({
                success:true,
    
                message:'Category updated successfully',
    
                category
            })
         } catch (error) {
            console.log(error);
            res.status(200).send({
                success:false,
    
                message:'Error in updating category',
    
                error
            })
         }
}

export const categoryControlller=async(req,res)=>{
         try {
            const category=await categoryModel.find({});

        
            res.status(200).send({
                success:true,
    
                message:'All categories list',
    
                category
            })
         } catch (error) {
            console.log(error);
            res.status(200).send({
                success:false,
    
                message:'Error in getting category',
    
                error
            })
         }
}

export const singleCategoryController=async(req,res)=>{
     try {

        const category=await categoryModel.findOne({slug:req.params.slug});

      
        res.status(200).send({
            success:true,

            message:'Get single category scuucessfully',

            category
        })
        
     } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,

            message:'Error in while getting single category',

            error
        })
     }
}

export const deleteCategoryController=async(req,res)=>{
    console.log(req)
    const {id}=req.params;
    try {

        await categoryModel.findByIdAndDelete(id);
        await productModel.deleteMany({category:id});
      
        res.status(200).send({
            success:true,

            message:'Category deleted successfully',

            
        })
        
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,

            message:'Error in  deleting category',

            error
        })
    }
}