import { productsFs } from "./products.fs.js";
import { productsMongoose } from "./products.mongoose.js";

let productDAO;

const DAO_OPTION = process.env.DAO_OPTION;
switch (DAO_OPTION) {
  case 'mongoose':
    productDAO = new productsMongoose();
    break;
  case 'fs':
    productDAO = new productsFs();
    break;
  default:
    productDAO = new productsMongoose();
}

export {productDAO};
