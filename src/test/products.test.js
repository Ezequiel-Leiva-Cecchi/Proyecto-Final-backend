import { expect } from 'chai';
import productsModel from '../models/porducts.model.js';

describe('Modelo de productos', () => {
    const validProduct = {
        title: 'Notebook Nexo',
        description: 'Producto de prueba para validar el esquema.',
        code: 'NX-001',
        price: 1200,
        stock: 5,
        category: 'Tecnología',
        imageUrl: 'https://example.com/notebook.jpg'
    };

    it('acepta un producto completo', () => {
        const product = new productsModel(validProduct);
        expect(product.validateSync()).to.equal(undefined);
        expect(product.status).to.equal(true);
    });

    it('requiere título, precio, stock, categoría e imagen', () => {
        const product = new productsModel({});
        const error = product.validateSync();
        expect(error).to.exist;
        expect(error.errors).to.have.property('title');
        expect(error.errors).to.have.property('price');
        expect(error.errors).to.have.property('stock');
        expect(error.errors).to.have.property('category');
        expect(error.errors).to.have.property('imageUrl');
    });

    it('conserva los datos comerciales del producto', () => {
        const product = new productsModel(validProduct);
        expect(product.code).to.equal('NX-001');
        expect(product.stock).to.equal(5);
        expect(product.category).to.equal('Tecnología');
    });
});
