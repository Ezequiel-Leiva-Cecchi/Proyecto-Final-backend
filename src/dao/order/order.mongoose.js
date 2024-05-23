import orderModel from "../../models/order.model.js";

export class orderMongoose {
    async createOrder({ user, products, totalAmount }) {
        try {
            const newOrder = await orderModel.create({
                user,
                products,
                totalAmount
            });
            return newOrder;
        } catch (error) {
            throw new Error('Error creating order: ' + error.message);
        }
    }
}
