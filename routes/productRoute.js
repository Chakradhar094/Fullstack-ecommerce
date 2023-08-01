import express from "express";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import { braintreePaymentController, braintreeTokenController, createproductController, deleteProductController, filterProductController, getProductController, getSingleProductController, getSingleProductPhotoController, productCategoryController, productCountController, productListController, relatedProductsController, searchProductController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable";
import {  getOrderController } from "../controllers/authController.js";


const router=express.Router();

router.post('/create-product',requireSignin,isAdmin,formidable(),createproductController)
router.get('/get-product',getProductController);
router.get('/get-product/:slug',getSingleProductController);
router.get('/get-photo/:pid',getSingleProductPhotoController);
router.delete('/delete-product/:id',deleteProductController)
router.put('/update-product/:id',requireSignin,isAdmin,formidable(),updateProductController);
router.post('/filter-products',filterProductController);
router.get('/product-count',productCountController);
router.get('/product-list/:page',productListController);
router.get('/search/:keyword',searchProductController);
router.get('/related-product/:pid/:cid',relatedProductsController)
router.get('/product-category/:slug',productCategoryController);
//paymnet token
router.get('/braintree/token',braintreeTokenController);
//paymnets
router.post('/braintree/payment',requireSignin,braintreePaymentController);

//orders

router.get("/orders",requireSignin,getOrderController);
  

  
export default router;