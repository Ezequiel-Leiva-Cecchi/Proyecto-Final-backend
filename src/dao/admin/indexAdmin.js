import { adminMongoose } from "./admin.mongoose.js";

let adminDAO;

const DAO_OPTION = process.env.DAO_OPTION; 

switch(DAO_OPTION) {
    case 'mongoose':
        adminDAO = new adminMongoose();
        break;
    default:
        adminDAO = new adminMongoose();
}

export { adminDAO };
