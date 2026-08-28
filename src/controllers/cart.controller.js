import * as cartService from '../services/cartService.js';

const ownsCart = (req, cid) => {
    const sessionCartId = req.session?.user?.cartId || req.session?.user?.cid;
    return sessionCartId && String(sessionCartId) === String(cid);
};

export const getCart = async (req, res) => {
    try {
        const { cid } = req.params;
        if (!ownsCart(req, cid)) return res.status(403).json({ error: 'Cart access denied' });
        const cart = await cartService.getCartById(cid);
        return res.json(cart);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const addCart = async (_req, res) => {
    try {
        const newCart = await cartService.createCart();
        return res.status(201).json({ message: 'Cart created', cartId: newCart._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const addProductInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        if (!ownsCart(req, cid)) return res.status(403).json({ error: 'Cart access denied' });
        const cart = await cartService.addProductToCart(cid, pid);
        const count = cart.products.reduce((total, item) => total + item.quantity, 0);
        return res.json({ message: 'Producto agregado al carrito', count });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        if (!ownsCart(req, cid)) return res.status(403).json({ error: 'Cart access denied' });
        await cartService.deleteCart(cid);
        return res.json({ message: 'Carrito eliminado' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        if (!ownsCart(req, cid)) return res.status(403).json({ error: 'Cart access denied' });
        await cartService.deleteProductInCart({ cid, pid });
        return res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const finalizePurchase = async (req, res) => {
    try {
        const { cid } = req.params;
        if (!ownsCart(req, cid)) return res.status(403).json({ error: 'Cart access denied' });
        const result = await cartService.finalizePurchase(cid, req.session.user);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
