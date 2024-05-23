import fs from 'fs';

const path = '../../data/cart.json';
class Cart {
    constructor({ id }) {
        this.id = id.toString();
        this.products = [];
    }
}

export class CartsFs {
    async validateFile() {
        try {
            const res = await fs.promises.readFile(path);
            const data = await JSON.parse(res);
            return data;
        } catch (error) {
            await fs.promises.writeFile(path, JSON.stringify([]));
            return []; 
        }
    }

    async getCart() {
        return await this.validateFile();
    }

    async getCartById(id) {
        const carts = await this.validateFile();
        const existCart = carts.find((cart) => cart.id.toString() === id.toString());
        if (!existCart) {
            throw new Error('CART NOT FOUND'); 
        } else {
            return existCart; 
        }
    }

    async addCart() {
        const carts = await this.validateFile();
        const newCart = new Cart({ id: carts.length + 1 });
        carts.push(newCart); 
        await fs.promises.writeFile(path, JSON.stringify(carts));
        return { id: newCart.id }; 
    }

    async addProductInCart(cartId, productId) {
        const carts = await this.validateFile();
        const indexInCart = carts.findIndex((cart) => cart.id === cartId);
        if (indexInCart < 0) {
            throw new Error('CART NOT FOUND'); 
        }
        const products = await productDAO.getProducts();
        if (!products.find((product) => product.id === productId)) {
            throw new Error('PRODUCT NOT FOUND'); 
        }
        const productIndex = carts[indexInCart].products.findIndex((product) => product.id === productId);
        if (productIndex < 0) {
            carts[indexInCart].products.push({ id: productId, quantity: 1 });
        } else {
            carts[indexInCart].products[productIndex].quantity++;
        }
        await fs.promises.writeFile(path, JSON.stringify(carts)); 
    }

    async deleteProductCart({ cartId, productId }) {
        const carts = await this.validateFile();
        const indexInCart = carts.findIndex((cart) => cart.id === cartId);
        if (indexInCart < 0) {
            throw new Error('CART NOT FOUND'); 
        }
        carts[indexInCart].products = carts[indexInCart].products.filter((product) => product.id !== productId);
        await fs.promises.writeFile(path, JSON.stringify(carts));
    }

    async deleteCart(id) {
        const carts = await this.validateFile();
        const indexInCart = carts.findIndex((cart) => cart.id === id);
        if (indexInCart < 0) {
            throw new Error(`Cart not found`); 
        }
        const deleteCart = carts[indexInCart]; 
        const updateCart = carts.filter((cart) => cart.id !== id); 
        await fs.promises.writeFile(path, JSON.stringify(updateCart));
        return deleteCart; 
    }
}
