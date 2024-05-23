import productsModel from "../../models/porducts.model.js";

export class productsMongoose {
    async getProducts() {
        const products = await productsModel.find().lean({ virtuals: true });
        console.log("Lista de productos obtenida:", products);
        return products;
    }
    async getPaginatedProducts(query, paginationOptions) {
        const products = await productsModel.paginate(
            { title: { $regex: query ? query : '', $options: 'i' } },
            { ...paginationOptions, lean: true }
        );

        const totalPages = Math.ceil(products.total / paginationOptions.limit);

        const currentPage = paginationOptions.page || 1;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;

        return {
            products: products.docs,
            currentPage,
            prevPage,
            nextPage,
            totalPages
        };
    }

    async getProductById(pid) {
        return await productsModel.findById(pid).lean({ virtuals: true });
    }
    async getProductsByIds(pid) {
        const groupProducts = await productsModel.find({ _id: { $in: pid} }).lean({ virtuals: true });
        return groupProducts;
    }
    async addProduct(productData) {
        const newProduct = new productsModel(productData);
        try {
            const savedProduct = await newProduct.save();
            return savedProduct;
        } catch (error) {
            throw error;
        }
    }
    async editProduct({ pid, updateData }) {
        return await productsModel.findOneAndUpdate({ _id: pid }, updateData);
    }
    async deleteProduct(pid) {
        return await productsModel.findOneAndDelete({ _id: pid });
    }
    async upgradeToPremium(userId) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(userId, { isPremium: true }, { new: true });

            if (!updatedUser) {
                throw new Error('User not found');
            }

            console.log("User upgraded to premium successfully:", updatedUser);
            return updatedUser;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}