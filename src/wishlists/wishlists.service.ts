import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlists.entity';
import { Repository, In } from 'typeorm';
import { Wish } from '../wishes/entities/wishes.entity';
import { User } from '../users/entities/users.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UserPublicResponseDto } from '../users/dto/user-public-response.dto';
import { PublicWishlistDto } from './dto/public-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(wishlist: CreateWishlistDto): Promise<Wishlist> {
    return this.wishlistRepository.save(wishlist);
  }

  async createOne(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const items = await this.wishRepository.findBy({
      id: In(createWishlistDto.itemsId),
    });

    const newWishlist = {
      ...createWishlistDto,
      owner: UserPublicResponseDto.getUser(user),
      items,
    };

    delete newWishlist.itemsId;
    return this.create(newWishlist);
  }

  async findOne(id: number, userId: number): Promise<PublicWishlistDto> {
    const wishlist = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (wishlist.owner.id !== +userId) {
      throw new UnauthorizedException(
        'Нельзя получить доступ к чужому вишлисту',
      );
    }

    return {
      ...wishlist,
      owner: UserPublicResponseDto.getUser(wishlist.owner),
    };
  }

  async findAll(userId: number): Promise<PublicWishlistDto[]> {
    const wishlists = await this.wishlistRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner', 'items'],
    });

    return wishlists.map((wishlist) => {
      return {
        ...wishlist,
        owner: UserPublicResponseDto.getUser(wishlist.owner),
      };
    });
  }

  async update(id: number, wishlist: UpdateWishlistDto): Promise<void> {
    await this.wishlistRepository.update({ id }, wishlist);
  }

  async updateOne(
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: ['owner'],
    });

    if (wishlist && wishlist.owner.id !== userId) {
      throw new UnauthorizedException();
    }

    const items = await this.wishRepository.findBy({
      id: In(updateWishlistDto.itemsId),
    });

    const newWishlist = {
      ...updateWishlistDto,
      id: wishlistId,
      updatedAt: new Date(),
      owner: UserPublicResponseDto.getUser(wishlist.owner),
      items,
    };

    delete newWishlist.itemsId;
    return this.wishlistRepository.save(newWishlist);
  }

  async remove(id: number) {
    await this.wishlistRepository.delete(id);
  }

  async removeOne(wishlistId: number, userId: number) {
    const wishlist = await this.findOne(wishlistId, userId);
    await this.remove(wishlistId);
    return wishlist;
  }
}
