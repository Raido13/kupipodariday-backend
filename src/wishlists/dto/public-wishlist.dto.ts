import { UserPublicResponseDto } from '../../users/dto/user-public-response.dto';

export class PublicWishlistDto {
  name: string;
  image: string;
  itemsId?: number[];
  owner: UserPublicResponseDto;
}
