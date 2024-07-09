import { Offer } from "../offers/entities/offers.entity";
import { User } from "../users/entities/users.entity";
import { Wish } from "../wishes/entities/wishes.entity";
import { Wishlist } from "../wishlists/entities/wishlists.entity";

export default () => ({
  database: {
    type: process.env.BD_TYPE,
    host: process.env.BD_HOST,
    port: parseInt(process.env.BD_PORT, 10),
    username: process.env.BD_USERNAME,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME,
    synchronize: process.env.BD_SYNCHRONIZE,
    logging: process.env.BD_LOGGING,
    entities: [User, Wish, Wishlist, Offer],
  }
});
