import express from "express";
import {registerController , loginController,testController, forgotPasswordController, updateProfileController, getAllOrdersController, updateOrderStatus } from "../controllers/authController.js";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
const router=express.Router();
//routing
//REGISTER ||METHOD POST
 router.post('/register',registerController)
//LOGIN 
router.post('/login',loginController)
//forgot password
router.post('/forgot-password',forgotPasswordController)


router.get('/test',requireSignin,isAdmin,testController)

//protected route auth
router.get('/auth-user',requireSignin,(req,res)=>{
    res.status(200).send({
        ok:true
    })
})

//update profile
router.put('/profile',requireSignin,updateProfileController);
router.get("/all-orders",requireSignin,isAdmin,getAllOrdersController);
router.put("/order-status/:orderId",requireSignin,isAdmin,updateOrderStatus);
export default router;