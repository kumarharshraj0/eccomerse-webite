import express from 'express';
import { addToCart, userCart, removeProductFromCart, clearCart, decreaseProductQty } from '../Controllers/Cart.js';

import { isUserAuthenticated,isAdminAuthenticated} from '../Middlewares/IsAuth.js';


const router=express.Router();

//add to cart
router.post('/add',isUserAuthenticated,addToCart)


//
// get user cart

router.get('/user',isUserAuthenticated,userCart)

// remove product from cart
router.delete("/remove/:productId",isUserAuthenticated,  removeProductFromCart);


// clear cart
router.delete("/clear",isUserAuthenticated,  clearCart);


// decrease items qty
router.post("/qty",isUserAuthenticated, decreaseProductQty );










export default router;