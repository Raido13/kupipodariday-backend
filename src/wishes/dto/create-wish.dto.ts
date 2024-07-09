import { Offer } from '../../offers/entities/offers.entity';
import { User } from '../../users/entities/users.entity';

export class CreateWishDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  link: string;
  image: string;
  price: number;
  raised: number;
  owner: User;
  offers: Offer[];
  copied: number;
}
