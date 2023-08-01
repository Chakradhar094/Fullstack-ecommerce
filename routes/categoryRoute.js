import express from 'express'
import { isAdmin, requireSignin } from '../middlewares/authMiddleware.js';
import { categoryController, categoryControlller, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';


const router=express.Router();

router.post('/create-category',requireSignin,isAdmin,categoryController)

router.put('/update-category/:id',requireSignin,isAdmin,updateCategoryController)
//get all cateogory
router.get('/get-category',categoryControlller);
//get single category

router.delete('/delete-category/:id',deleteCategoryController)




export default router;