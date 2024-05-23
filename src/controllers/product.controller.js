import * as productsServices from '../services/productsServices.js';
import { validateAddProducts, validateEditProducts } from "../utils/validation.js"; 


const isProductOwner = async (productId, userId) => {
    const product = await productsServices.getProductById(productId);
    return product.owner === userId;
};

export const getProducts = async (req, res, next) => {
    try {
        const { limit, sort, page, query } = req.query; 
        const options = {
            limit: !limit ? 10 : limit, 
            sort: sort ? { price: sort } : undefined, 
            page: page ? page : 1, 
        };
        const products = await productsServices.getProducts(query, options);
        res.json({ status: 'success', ...products });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const { productId } = req.params; 
        const product = await productsServices.getProductById(productId);
        res.json({ product });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const addProduct = async (req, res, next) => {
    const { body, user } = req;
    try {
        const absentProperty = validateAddProducts(body);
        if (absentProperty) {
            throw new Error(`Absent property ${absentProperty}`);
        }

        // const owner = user.isAdmin ? user.email : 'admin';

        const productData = { ...body};

        await productsServices.addProduct(productData);

        res.json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const editProduct = async (req, res, next) => {
    try {
        const { body, params, user } = req;
        const { productId } = params; 
        const validation = validateEditProducts(body);
        if (Object.keys(validation).length === 0) {
            throw new Error('At least one of the following properties is required: name, price, stock, category, description, code');
        }
        
        await productsServices.editProduct(productId, validation);
        res.json({ message: 'Successfully edit product' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params; 
        const { user } = req;

        const isOwner = await isProductOwner(productId, user.email);
        if (!isOwner) {
            return res.status(403).json({ error: 'You are not authorized to delete this product' });
        }

        await productsServices.deleteProduct(productId);
        res.json({ message: 'Successfully delete product' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
