import { UserPublicResponseDto } from '../../users/dto/user-public-response.dto';

export class PublicOfferDto {
  itemId?: number;
  amount: number;
  hidden: boolean;
  user: UserPublicResponseDto;
}
