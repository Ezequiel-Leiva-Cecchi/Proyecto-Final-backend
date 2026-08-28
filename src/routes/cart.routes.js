import { Router } from 'express';
import {
    getCart,
    addCart,
    addProductInCart,
    deleteProductFromCart,
    deleteCart,
    finalizePurchase
} from '../controllers/cart.controller.js';
import { requireUserAuth } from '../middlewares/authMiddleware.js';

const cartRouter = Router();

cartRouter.use(requireUserAuth);
cartRouter.get('/:cid', getCart);
cartRouter.post('/', addCart);
cartRouter.post('/:cid/p/:pid', addProductInCart);
cartRouter.delete('/:cid/p/:pid', deleteProductFromCart);
cartRouter.delete('/:cid', deleteCart);
cartRouter.post('/:cid/purchase', finalizePurchase);

export default cartRouter;
