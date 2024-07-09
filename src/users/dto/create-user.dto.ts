import { Offer } from '../../offers/entities/offers.entity';
import { Wish } from '../../wishes/entities/wishes.entity';
import { Wishlist } from '../../wishlists/entities/wishlists.entity';

export class CreateUserDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  about: string;
  avatar: string;
  email: string;
  wishes: Wish[];
  wishlists: Wishlist[];
  offers: Offer[];
}
