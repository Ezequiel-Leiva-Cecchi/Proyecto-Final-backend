import { Router } from "express";
import { getCart, addCart, addProductInCart, deleteProductFromCart, deleteCart,finalizePurchase} from '../controllers/cart.controller.js';
import { requireUserAuth } from "../middlewares/authMiddleware.js";
const cartRouter = Router();

cartRouter.get('/:cid', getCart);
cartRouter.post('/',requireUserAuth, addCart);
cartRouter.post('/:cid/p/:pid',requireUserAuth, addProductInCart);
cartRouter.delete('/:cid/p/:pid',requireUserAuth, deleteProductFromCart); 
cartRouter.delete('/:cid',requireUserAuth, deleteCart);
cartRouter.post('/:cid/purchase', requireUserAuth, finalizePurchase);
export default cartRouter;
