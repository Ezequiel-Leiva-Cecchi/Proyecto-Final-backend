import mongoose from "mongoose";
import { expect } from "chai";
import supertest from "supertest";

import CartRouter from "../routes/cart.routes.js";
import { cartDAO } from "../dao/cart/indexCart.js";

const request = supertest(CartRouter);

describe('Testing Cart Routes', () => {
    let app;
    let cartId;

    before(async function () {
        app = CartRouter;
        await mongoose.connect('mongodb+srv://ezequielleivacecchi:hALl0CgkEToU97kJ@testingcoder.hb2y0h9.mongodb.net/test');
    });

    afterEach(async function () {
        await mongoose.connection.collections.carts.drop();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    it('Debe permitir agregar un nuevo carrito', async function () {
        const res = await request.post('/').send();
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id');
        cartId = res.body._id;
        
    });

    it('Debe permitir agregar un producto al carrito', async function () {
        const res = await request.post(`/${cartId}/p`).send({ productId: "PRODUCT_ID_HERE" });
        expect(res.status).to.equal(200);
        const cart = await cartDAO.getCartById(cartId);
        expect(cart.products).to.be.an('array').that.is.not.empty;
    });

    it('Debe permitir eliminar un producto del carrito', async function () {
        const res = await request.delete(`/${cartId}/p/PRODUCT_ID_HERE`).send();
        expect(res.status).to.equal(200);
        const cart = await cartDAO.getCartById(cartId);
        expect(cart.products).to.be.an('array').that.is.empty;
        
    });

    it('Debe permitir eliminar un carrito por su ID', async function () {
        const res = await request.delete(`/${cartId}`).send();
        expect(res.status).to.equal(200);
        const cart = await cartDAO.getCartById(cartId);
        expect(cart).to.be.null;
        
    });
});