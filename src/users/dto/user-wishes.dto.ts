import { Offer } from '../../offers/entities/offers.entity';

export class UserWishesDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  link: string;
  image: string;
  price: number;
  raised: number;
  offers: Offer[];
  copied: number;
}
