import { randomUUID } from 'node:crypto';
import { cartDAO } from '../dao/cart/indexCart.js';
import { productDAO } from '../dao/product/indexProducts.js';
import ticketModel from '../models/ticket.model.js';

const productIdOf = (item) => item?.product?._id?.toString?.() || item?.product?.toString?.();

export const createCart = () => cartDAO.createCart();
export const getCartById = (cid) => cartDAO.getCartById(cid);

export const addProductToCart = async (cid, pid) => {
    const cart = await cartDAO.getCartById(cid);
    const product = await productDAO.getProductById(pid);

    if (!cart || !product) throw new Error('Cart or product not found');
    if (!product.status || product.stock < 1) throw new Error('Product out of stock');

    const index = cart.products.findIndex((item) => productIdOf(item) === String(pid));
    const nextQuantity = index >= 0 ? cart.products[index].quantity + 1 : 1;
    if (nextQuantity > product.stock) throw new Error('No hay stock suficiente');

    if (index >= 0) cart.products[index].quantity = nextQuantity;
    else cart.products.push({ product: product._id, quantity: 1 });

    await cart.save();
    return cart;
};

export const deleteCart = (cid) => cartDAO.deleteCart(cid);
export const deleteProductInCart = ({ cid, pid }) => cartDAO.deleteProductCart(cid, pid);

export const finalizePurchase = async (cid, purchaser) => {
    const cart = await cartDAO.getCartById(cid);
    if (!cart) throw new Error('Cart not found');

    let totalAmount = 0;
    const failedProducts = [];
    const purchasedProducts = new Set();

    for (const item of cart.products) {
        const product = item.product;
        if (!product) continue;

        if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
            totalAmount += item.quantity * product.price;
            purchasedProducts.add(product._id.toString());
        } else {
            failedProducts.push(product._id.toString());
        }
    }

    cart.products = cart.products.filter((item) => !purchasedProducts.has(productIdOf(item)));
    await cart.save();

    let ticket = null;
    if (totalAmount > 0) {
        ticket = await ticketModel.create({
            cartId: cart._id,
            code: randomUUID(),
            purchaseDatetime: new Date(),
            amount: totalAmount,
            purchaser: {
                email: purchaser?.email || 'sin-email@local',
                name: [purchaser?.first_name, purchaser?.last_name].filter(Boolean).join(' ') || purchaser?.email || 'Cliente'
            }
        });
    }

    return {
        totalAmount,
        failedProducts,
        purchasedCount: purchasedProducts.size,
        ticket: ticket ? { id: ticket._id.toString(), code: ticket.code } : null
    };
};
