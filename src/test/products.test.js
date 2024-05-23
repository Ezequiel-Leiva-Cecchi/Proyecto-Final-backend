import mongoose from "mongoose";
import { expect } from "chai";
import supertest from "supertest";

import ProductsRouter from "../routes/products.routes.js";
import { productDAO } from "../dao/product/indexProducts.js";

const request = supertest(ProductsRouter);

describe('Testing Products Routes', () => {
    let app;
    let productId;

    before(async function () {
        app = ProductsRouter;
        console.log("Conectando a la base de datos...");
        await mongoose.connect('mongodb+srv://ezequielleivacecchi:hALl0CgkEToU97kJ@testingcoder.hb2y0h9.mongodb.net/test');
        console.log("Conexión exitosa a la base de datos");
    });

    afterEach(async function () {
        await mongoose.connection.collections.products.drop();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    it('Debe permitir agregar un nuevo producto', async function () {
        const productData = {
            title: 'Product Test',
            description: 'This is a test product',
            category: 'Samsung',
            stock: 10,
            code: 'AEQW12',
            price: 10.99
        };
        const res = await productDAO.addProduct(productData);
        expect(res).to.exist;
        expect(res).to.have.property('_id');
        productId = res._id;
    });

    it('Debe permitir obtener la lista de productos', async function () {
        const res = await productDAO.getProducts();
        expect(res).to.be.an('array');
        expect(res).to.have.length.above(0);
    });

    it('Debe permitir obtener un producto por su ID', async function () {
        const res = await productDAO.getProductById(productId);
        expect(res).to.exist;
        expect(res).to.have.property('title').to.equal('Product Test');
    });

    it('Debe permitir editar un producto existente', async function () {
        const updatedProductData = {
            title: 'Updated Product Test',
            description: 'This is an updated test product',
            price: 15.99
        };

        const res = await productDAO.editProduct({ pid: productId, updateData: updatedProductData });
        expect(res).to.exist;
        expect(res).to.have.property('title').to.equal('Updated Product Test');
    });

    it('Debe permitir eliminar un producto por su ID', async function () {
        const res = await productDAO.deleteProduct(productId);
        expect(res).to.exist;
        expect(res).to.have.property('deletedCount').to.equal(1);
    });
});
