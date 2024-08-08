import { Offer } from '../offers/entities/offers.entity';
import { User } from '../users/entities/users.entity';
import { Wish } from '../wishes/entities/wishes.entity';
import { Wishlist } from '../wishlists/entities/wishlists.entity';

export default () => ({
  database: {
    type: process.env.BD_TYPE,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: process.env.BD_SYNCHRONIZE,
    logging: process.env.BD_LOGGING,
    entities: [User, Wish, Wishlist, Offer],
  },
});
