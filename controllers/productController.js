import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs'
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import { error } from "console";
import orderModel from "../models/orderModel.js";

        var gateway = new braintree.BraintreeGateway({
            environment: braintree.Environment.Sandbox,
            merchantId: "5syr7mc5b3bhj843",
            publicKey:"pq5yh4kb28vhz9mt",
            privateKey: "d3c0d9f7ba0093db074e1fdd99b30713",
        })
export const createproductController = async (req, res) => {
    try {

        const { name, slug, description, price, quantity, category, shipping } = req.fields;

        const { photo } = req.files
        //validation

        switch (true) {
            case !name:
                return res.status(200).send({
                    error: 'Name is required'
                })
            case !description:
                return res.status(200).send({
                    error: 'description is required'
                })
            case !price:
                return res.status(200).send({
                    error: 'price is required'
                })
            case !category:
                return res.status(200).send({
                    error: 'category is required'
                })
            case !quantity:
                return res.status(200).send({
                    error: 'quantity is required'
                })
            case photo && photo.size > 1000000:
                return res.status(200).send({
                    error: 'photo is required and less than 1MB'
                })
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) });

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.conTentType = photo.type
        }
        await products.save();
        res.status(200).send({
            success: true,
            message: "product created succesfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in creating product',
            error
        })
    }
}

//get products

export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).select('-photo').limit(12).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: 'All prodcuts',
            count: products.length,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in getting products',
            error
        })
    }
}

export const getSingleProductController = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await productModel.findOne({ slug }).select('-photo').populate('category')
        res.status(200).send({
            success: true,
            message: 'Single prodcut',
            product
        })

    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in getting single product',
            error
        })
    }
}

//get photo

export const getSingleProductPhotoController = async (req, res) => {
    try {
        const { pid } = req.params;
        const prodcut = await productModel.findOne({ _id: pid }, { photo: 1 });
        if (prodcut.photo.data) {
            res.set('Content-type', prodcut.photo.conTentType)
            return res.status(200).send(

                prodcut.photo.data
            )
        }
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in getting photo of the product',
            error
        })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in deleting product',
            error
        })
    }
}

//update product

export const updateProductController = async (req, res) => {
    try {

        const { name, slug, description, price, quantity, category, shipping } = req.fields;

        const { photo } = req.files
        //validation

        switch (true) {
            case !name:
                return res.status(200).send({
                    error: 'Name is required'
                })
            case !description:
                return res.status(200).send({
                    error: 'description is required'
                })
            case !price:
                return res.status(200).send({
                    error: 'price is required'
                })
            case !category:
                return res.status(200).send({
                    error: 'category is required'
                })
            case !quantity:
                return res.status(200).send({
                    error: 'quantity is required'
                })
            case photo && photo.size > 1000000:
                return res.status(200).send({
                    error: 'photo is required and less than 1MB'
                })
        }
        const products = await productModel.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true })

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.conTentType = photo.type
        }
        await products.save();
        res.status(200).send({
            success: true,
            message: "product Updated succesfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in Updating product',
            error
        })
    }
}

export const filterProductController = async (req, res) => {

    try {
        let filter = {};

        const { checked, radio } = req.body;

        if (checked.length > 0) {
            filter.category = checked;
        }
        if (radio.length) {
            filter.price = { $gte: radio[0], $lte: radio[1] }
        }
        const products = await productModel.find(filter);

        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in filtering category',
            error
        })
    }

}

export const productCountController = async (req, res) => {
    try {
         const total=await productModel.find({}).estimatedDocumentCount();
         res.status(200).send({
            success:true,
            total
         })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in product count',
            error
        })
    }
}

export const productListController = async (req, res) => {
    try {
        const perpage=2;
        const page=req.params.page?req.params.page:perpage;
        const products=await productModel
        .find({})
        .select("-photo")
        .skip((page-1)*perpage)
        .limit(perpage)
        .sort({createdAt:-1})
         res.status(200).send({
            success:true,
            products
         })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in per page ctrl',
            error
        })
    }
}


export const searchProductController=async(req,res)=>{
    try {
         const {keyword}=req.params;
         const products=await productModel.find({$or:[{name:{$regex:keyword,$options:"i"}}
         ,{description:{$regex:keyword,$options:"i"}}]}).select("-photo");
         res.json(products);
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in searching product API',
            error
        })
    }
}

export const relatedProductsController=async(req,res)=>{
           try {
               const {pid,cid}=req.params;
               const products=await productModel.find({category:cid,_id:{$ne:pid}}).select('-photo').limit(3).populate("category");
               res.status(200).send({
                success:true,
                products
               })
               
           } catch (error) {
            console.log(error);
            res.status(200).send({
                success: false,
                message: 'Error in searching related products',
                error
            })
           }
}

export const productCategoryController=async(req,res)=>{
    try {
        const category=await categoryModel.findOne({slug:req.params.slug});
        const products=await productModel.find({category}).populate("category");
        res.status(200).send({
            success:true,
            message:'All category products',
            products
           })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in getiing related category products',
            error
        })
    }
}
//payment api

export const braintreeTokenController=async(req,res)=>{
            try {
            
                gateway.clientToken.generate({},async(error,response)=>{
                    if(error){
                        res.status(200).send({
                            error

                        })
                    }else res.send(response);
                })
            } catch (error) {
                console.log(error);

            }
}

export const braintreePaymentController=async(req,res)=>{
    try {
        const { cart,nonce,}=req.body;
        let total=0;
        cart.map(i=>total+=i.price);
        let newTransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },(error,result)=>{
if(result){
    const order=new orderModel({
        products:cart,
        payment:result,
        buyer:req.user._id,

    }).save()
    res.json({ok:true})
}else{
    res.status(500).send(error)
}
        })
    } catch (error) {
        console.log(error);
    }
    
}

