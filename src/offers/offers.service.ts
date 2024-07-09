import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offers.entity';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wishes.entity';
import { User } from '../users/entities/users.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { PublicOfferDto } from './dto/public-offer.dto';
import { UserPublicResponseDto } from '../users/dto/user-public-response.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(offer: CreateOfferDto): Promise<Offer> {
    return this.offersRepository.save(offer);
  }

  async createOne(
    offer: CreateOfferDto,
    userId: number,
  ): Promise<PublicOfferDto> {
    const currentUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const item = await this.wishesRepository.findOne({
      where: { id: offer.itemId },
      relations: ['offers', 'owner', 'offers.user'],
    });

    if (item.owner.id === currentUser.id) {
      throw new ForbiddenException(
        'Нельзя вносить деньги на собственные желания',
      );
    }

    const newOffer = {
      ...offer,
      item,
      user: currentUser,
    };

    delete newOffer.itemId;

    const sum: number =
      item.offers.reduce((acc, curr) => (acc += curr.amount), 0) + offer.amount;

    if (sum > item.price) {
      throw new ForbiddenException('Слишком большая сумма');
    } else if (sum === item.price) {
      // TODO: send email to owner
    }

    item.raised = Math.round(sum * 1000) / 1000;
    await this.wishesRepository.update(item.id, { raised: sum });
    const createdOffer = await this.create(newOffer);

    return {
      ...createdOffer,
      user: UserPublicResponseDto.getUser(createdOffer.user),
    };
  }

  async findOne(id: number, userId: number): Promise<PublicOfferDto> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (offer.user.id !== userId) {
      throw new UnauthorizedException();
    }

    return {
      ...offer,
      user: UserPublicResponseDto.getUser(offer.user),
    };
  }

  async findAll(userId: number): Promise<Offer[]> {
    return this.offersRepository.findBy({ user: { id: userId } });
  }

  async update(id: number, offer: UpdateOfferDto): Promise<void> {
    await this.offersRepository.update({ id }, offer);
  }

  async remove(id: number): Promise<void> {
    await this.offersRepository.delete({ id });
  }
}
