import { cartDAO } from '../dao/cart/indexCart.js'; 
import { productDAO } from '../dao/product/indexProducts.js';

export const createCart = async () => {
    try {
        const newCart = await cartDAO.createCart();
        console.log("Cart created successfully:", newCart);
        return newCart; 
    } catch (error) {
        console.error("Error creating cart:", error);
        throw new Error('Failed to create cart'); 
    }
};

export const getCartById = async (cid) => {
    try {
        console.log("Fetching cart with ID:", cid); 
        const cart = await cartDAO.getCartById(cid);
        console.log("Retrieved cart:", cart);  
        return cart;
    } catch (error) {
        console.error("Error fetching cart:", error); 
        throw new Error('Failed to get cart');
    }
};

export const addProductToCart = async (cid, pid) => {
    try {
        const cart = await cartDAO.getCartById(cid);
        const product = await productDAO.getProductById(pid);
        
        if (!cart || !product) {
            throw new Error('Cart or product not found');
        }

        if (product.stock < 1) {
            throw new Error('Product out of stock');
        }

        const existProductInCartIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (existProductInCartIndex >= 0) {
            cart.products[existProductInCartIndex].quantity++;
        } else {
            cart.products.push({ 
                product: product._id, 
                quantity: 1,
                title: product.title,
                price: product.price,
                imageUrl: product.imageUrl,
                code: product.code
            });
        }

        product.stock--; 

        await cart.save(); 
    } catch (error) {
        console.error(error)
        throw new Error('Failed to add product to cart: ' + error.message);
    }
};


export const deleteCart = async (cid) => {
    try {
        await cartDAO.deleteCart(cid);
    } catch (error) {
        console.log(error);
        throw new Error('Failed to delete cart');
    }
};

export const deleteProductInCart = async ({ cid, pid }) => {
    try {
        await cartDAO.deleteProductCart( cid, pid );
    } catch (error) {
        throw new Error('Failed to delete product from cart');
    }
};

export const finalizePurchase = async (cid) => {
    try {
        const cart = await cartDAO.getCartById(cid);
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

        if (failedProducts.length > 0) {
            return { totalAmount, failedProducts };
        }

        await cartDAO.deleteCart(cid);

        return { totalAmount, failedProducts };
    } catch (error) {
        throw new Error('Failed to finalize purchase: ' + error.message);
    }
};