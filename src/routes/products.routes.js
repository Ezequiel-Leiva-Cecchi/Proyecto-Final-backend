import { Router } from 'express';
import { getProducts, getProduct, addProduct, editProduct, deleteProduct } from '../controllers/product.controller.js';
import { requireAdminAuth} from '../middlewares/authMiddleware.js';
const ProductsRouter = Router();
ProductsRouter.get('/', getProducts);
ProductsRouter.get('/:productId', getProduct);
ProductsRouter.post('/',requireAdminAuth, addProduct);
ProductsRouter.put('/:productId',requireAdminAuth, editProduct);
ProductsRouter.delete('/:productId',requireAdminAuth, deleteProduct);

export default ProductsRouter;
