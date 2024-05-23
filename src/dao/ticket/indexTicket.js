import { ticketMongoose } from "./ticket.mongoose.js";

let ticketDAO;

const DAO_OPTION = process.env.DAO_OPTION;

switch (DAO_OPTION) {
    case 'mongoose':
        ticketDAO = new ticketMongoose();
        break;
    default:
        ticketDAO = new ticketMongoose();
}

export { ticketDAO };
