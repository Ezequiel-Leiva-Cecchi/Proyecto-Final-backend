import cartModel from '../../models/carts.model.js';
import { productDAO } from '../product/indexProducts.js';

const productIdOf = (item) => item?.product?._id?.toString?.() || item?.product?.toString?.();

export class cartMongoose {
    async getCartById(cid) {
        return cartModel.findById(cid).populate('products.product');
    }

    async addProductCarts(cid, pid) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error('Cart not found');

        const product = await productDAO.getProductById(pid);
        if (!product) throw new Error('Product not found');

        const index = cart.products.findIndex((item) => productIdOf(item) === String(pid));
        if (index >= 0) cart.products[index].quantity += 1;
        else cart.products.push({ product: product._id, quantity: 1 });

        await cart.save();
        return cart;
    }

    async deleteProductCart(cid, pid) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error('Cart not found');

        const before = cart.products.length;
        cart.products = cart.products.filter((item) => productIdOf(item) !== String(pid));
        if (cart.products.length === before) throw new Error('Product is not in the cart');

        await cart.save();
        return cart;
    }

    async deleteCart(id) {
        return cartModel.findByIdAndDelete(id);
    }

    async updateQuantityProduct(cid, pid, updateQuantity) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error('Cart not found');

        const index = cart.products.findIndex((item) => productIdOf(item) === String(pid));
        if (index < 0) throw new Error('Product is not in the cart');

        cart.products[index].quantity = Math.max(1, Number(updateQuantity) || 1);
        await cart.save();
        return cart;
    }

    async createCart() {
        return cartModel.create({ products: [] });
    }
}
