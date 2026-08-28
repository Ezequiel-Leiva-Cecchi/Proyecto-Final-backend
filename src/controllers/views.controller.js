import { cartDAO } from '../dao/cart/indexCart.js';
import { productDAO } from '../dao/product/indexProducts.js';
import { usersDAO } from '../dao/users/indexUsers.js';

const getCartContext = async (user) => {
    const cartId = user?.cartId || user?.cid;
    if (!cartId) return { cartId: null, cartCount: 0 };
    try {
        const cart = await cartDAO.getCartById(cartId);
        const cartCount = cart?.products?.reduce((total, item) => total + item.quantity, 0) || 0;
        return { cartId: String(cartId), cartCount };
    } catch (_error) {
        return { cartId: String(cartId), cartCount: 0 };
    }
};

export const renderIndexPage = async (req, res, next) => {
    try {
        const products = await productDAO.getProducts();
        const cartContext = await getCartContext(req.session.user);
        return res.render('index', {
            title: 'Nexo Store',
            products: products.slice(0, 8),
            totalProducts: products.length,
            ...cartContext
        });
    } catch (error) {
        return next(error);
    }
};

export const renderProductsPage = async (req, res, next) => {
    try {
        const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 48);
        const page = Math.max(Number(req.query.page) || 1, 1);
        const query = req.query.query || '';
        const sort = req.query.sort === 'desc' ? -1 : req.query.sort === 'asc' ? 1 : undefined;
        const result = await productDAO.getPaginatedProducts(query, {
            limit,
            page,
            sort: sort ? { price: sort } : undefined
        });
        const cartContext = await getCartContext(req.session.user);
        return res.render('products', {
            title: 'Catálogo · Nexo Store',
            products: result.products,
            page: result.currentPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            totalPages: result.totalPages,
            query,
            sort: req.query.sort || '',
            ...cartContext
        });
    } catch (error) {
        return next(error);
    }
};

export const renderProductPage = async (req, res, next) => {
    try {
        const product = await productDAO.getProductById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');
        const cartContext = await getCartContext(req.session.user);
        return res.render('product', {
            title: `${product.title} · Nexo Store`,
            product,
            ...cartContext
        });
    } catch (error) {
        return next(error);
    }
};

export const renderCartPage = async (req, res, next) => {
    try {
        const sessionCartId = req.session.user?.cartId || req.session.user?.cid;
        if (!sessionCartId || String(sessionCartId) !== String(req.params.cid)) {
            return res.status(403).send('No tenés acceso a este carrito.');
        }
        const cart = await cartDAO.getCartById(req.params.cid);
        if (!cart) return res.status(404).send('Carrito no encontrado');

        const products = cart.products.map((item) => {
            const product = item.product;
            const price = Number(product?.price || 0);
            return {
                id: product?._id?.toString?.() || product?.id,
                title: product?.title || 'Producto no disponible',
                imageUrl: product?.imageUrl || '',
                category: product?.category || 'Producto',
                price,
                quantity: item.quantity,
                subtotal: price * item.quantity
            };
        });
        const total = products.reduce((sum, item) => sum + item.subtotal, 0);

        return res.render('cart', {
            title: 'Mi carrito · Nexo Store',
            products,
            total,
            cartId: String(sessionCartId),
            cartCount: products.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        return next(error);
    }
};

export const renderLoginPage = (_req, res) => res.render('login', { title: 'Ingresar · Nexo Store' });
export const renderRegisterPage = (_req, res) => res.render('register', { title: 'Crear cuenta · Nexo Store' });
export const renderSendRecoveryEmailPage = (_req, res) => res.render('send-recovery-email', { title: 'Recuperar contraseña · Nexo Store' });
export const renderResetPasswordPage = (req, res) => res.render('reset-password', {
    title: 'Nueva contraseña · Nexo Store',
    resetToken: req.params.resetToken
});

export const renderAdminPage = async (_req, res, next) => {
    try {
        const users = await usersDAO.getAllUsers();
        return res.render('admin-options', {
            title: 'Administración · Nexo Store',
            users
        });
    } catch (error) {
        return next(error);
    }
};
