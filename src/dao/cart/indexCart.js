import { CartsFs } from "./cart.fs.js";
import { cartMongoose } from "./cart.mongoose.js";

let cartDAO;

const DAO_OPTION = process.env.DAO_OPTION;

switch (DAO_OPTION) {
    case 'mongoose':
        cartDAO = new cartMongoose(); 
        break;
    case 'fs':
        cartDAO = new CartsFs(); 
        break;
    default:
        cartDAO = new cartMongoose(); 
}

export { cartDAO };