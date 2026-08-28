import { expect } from 'chai';
import mongoose from 'mongoose';
import cartModel from '../models/carts.model.js';

describe('Modelo de carrito', () => {
    it('crea un carrito vacío válido', () => {
        const cart = new cartModel({ products: [] });
        expect(cart.validateSync()).to.equal(undefined);
        expect(cart.products).to.be.an('array').that.is.empty;
    });

    it('acepta productos con referencia y cantidad positiva', () => {
        const cart = new cartModel({
            products: [{
                product: new mongoose.Types.ObjectId(),
                quantity: 2
            }]
        });
        expect(cart.validateSync()).to.equal(undefined);
        expect(cart.products[0].quantity).to.equal(2);
    });

    it('rechaza cantidades menores a uno', () => {
        const cart = new cartModel({
            products: [{
                product: new mongoose.Types.ObjectId(),
                quantity: 0
            }]
        });
        const error = cart.validateSync();
        expect(error).to.exist;
        expect(error.errors).to.have.property('products.0.quantity');
    });
});
