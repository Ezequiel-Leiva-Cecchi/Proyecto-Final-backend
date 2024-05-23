import cartModel from "../../models/carts.model.js";
import { productDAO } from "../product/indexProducts.js";
import ticketModel from "../../models/ticket.model.js";

export class cartMongoose {
    async getCartById(cid) {
        try {
            console.log("Fetching cart with ID:", cid);
            const cart = await cartModel.findOne({ _id: cid }).populate({ path: 'products.product', model: 'Product', option: { lean: { virtuals: true } }, });
            return cart;
        } catch (error) {
            throw new Error('Failed to get cart');
        }
    }

    async addProductCarts(cid, pid) {
        const cart = await this.getCartById(cid);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const product = await productDAO.getProductsById(pid);
        if (!product) {
            throw new Error('Product not found');
        }
        const existProductInCart = cart.products.findIndex((item) => item.product.id === pid);
        if (existProductInCart >= 0) {
            cart.products[existProductInCart].quantity++;
        } else {
            cart.products.push({ product: product._id, quantity: 1, });
        }
        await cart.save();
    }

    async deleteProductCart(cid, pid) {
        console.log("Deleting product from cart. Cart ID:", cid, "Product ID:", pid);
        let cart = await this.getCartById(cid);
        console.log("Cart:", cart);
        if (!cart) {
            console.log("Cart not found");
            throw new Error('Cart not found');
        }
        const existProductInCart = cart.products.findIndex((item) => item.product.id === pid);
        console.log("Exist product index:", existProductInCart);
        if (existProductInCart < 0) {
            console.log("Product is not in the cart");
            throw new Error('Product is not in the cart');
        }
        cart.products = cart.products.filter((item) => item.product.id !== pid);
        console.log("Cart after removing product:", cart);
        await cart.save();
        console.log("Product deleted from cart successfully");
    }

    async deleteCart(id) {
        return await cartModel.findOneAndDelete({ _id: id });
    }

    async updateQuantityProduct(cid, pid, updateQuantity) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const product = await productDAO.getProductsById(pid);
        if (!product) {
            throw new Error('Product not found');
        }
        const existProductInCart = cart.products.findIndex((item) => item.product.id === pid);
        if (existProductInCart < 0) {
            throw new Error('Product is not in the cart');
        }
        cart.products[existingCartProductIndex].quantity =
            updateQuantity <= 0 ? 1 : updateQuantity;
        await cart.save();
    }

    async createCart() {
        try {
            const newCart = await cartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async finalizePurchase(cid) {
        try {
            const cart = await this.getCartById(cid);
            if (!cart) {
                throw new Error('Cart not found');
            }

            let totalAmount = 0;
            const failedProducts = [];

            for (const item of cart.products) {
                const product = await productDAO.getProductById(item.product._id);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                    totalAmount += item.quantity * product.price;
                } else {
                    failedProducts.push(product._id);
                }
            }

            const ticket = await ticketModel.create({
                amount: totalAmount
            });

            if (failedProducts.length > 0) {
                return { ticket, failedProducts };
            }

            cart.products = cart.products.filter(item => !failedProducts.includes(item.product._id));
            await cart.save();

            return { ticket, failedProducts };
        } catch (error) {
            throw new Error('Failed to finalize purchase: ' + error.message);
        }
    }
}
