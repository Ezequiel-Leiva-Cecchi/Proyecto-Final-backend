import fs from 'fs';

const path = '../../data/products.json';

class Products {
    constructor(id, name, price, stock, category, description, status, code) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.description = description;
        this.status = status;
        this.code = code;
        this.id = id;
    }
}

const readFileAsync = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const writeFileAsync = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export class productsFs {
    async readOrInitializeFileData() {
        try {
            const response = await readFileAsync(path);
            const data = await JSON.parse(response);
            return data;
        } catch (error) {
            await writeFileAsync(path, JSON.stringify([]));
            return [];
        }
    }

    async getProducts(limit) {
        const products = await this.readOrInitializeFileData();
        return limit > 0 ? products.slice(0, limit) : products;
    }

    async addProducts(object) {
        const products = await this.readOrInitializeFileData();
        const product = new Products(products.length + 1, ...object);
        products.push(product);
        await writeFileAsync(path, JSON.stringify(products));
    }

    async getProductsById(id) {
        const products = await this.readOrInitializeFileData();
        const productsExist = products.find((product) => product.id.toString() === id.toString());
        if (!productsExist) {
            throw new Error(`The product was not found`);
        } else {
            return productsExist;
        }
    }

    async editProducts(id, object) {
        const products = await this.readOrInitializeFileData();
        let productsExist = products.findIndex((product) => product.id === id);
        if (productsExist < 0) {
            return null;
        }
        products[productsExist] = {
            ...products[productsExist],
            ...object,
        };
        await writeFileAsync(path, JSON.stringify(products));
        return products[productsExist];
    }

    async deleteProducts(id) {
        const products = await this.readOrInitializeFileData();
        const product = products.find((product) => product.id.toString() === id.toString());
        if (!product) {
            return null;
        } else {
            const updateProducts = products;
            updateProducts.filter((product) => product.id !== id);
            updateProducts.map((product, index) => {
                return { ...product, id: (index + 1).toString() };
            });
            await writeFileAsync(path, JSON.stringify(updateProducts));
            return product;
        }
    }

}
