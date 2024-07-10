import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wishes.entity';
import { User } from '../users/entities/users.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UserPublicResponseDto } from '../users/dto/user-public-response.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: number, wish: CreateWishDto): Promise<Wish> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    const newWish = this.wishesRepository.create({
      ...wish,
      owner: user,
      raised: 0,
    });
    return this.wishesRepository.save(newWish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find();
  }

  async findOne(id: number): Promise<Wish> {
    return this.wishesRepository.findOneBy({ id });
  }

  async findLast(): Promise<Wish[]> {
    const wish = await this.wishesRepository.find({
      order: { id: 'DESC' },
      take: 30,
      relations: ['owner'],
    });
    return wish;
  }

  async findTop(): Promise<Wish[]> {
    const wish = await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 10,
      relations: ['owner'],
    });
    return wish;
  }

  async update(id: number, wish: UpdateWishDto, userId): Promise<void> {
    const wishToUpdate = await this.findOne(id);

    if (wishToUpdate.owner.id !== userId) {
      throw new ForbiddenException('Нельзя редактировать чужие желания');
    }

    await this.wishesRepository.update({ id }, wish);
  }

  async remove(id: number, userId: number): Promise<void> {
    const wishToDelete = await this.findOne(id);

    if (wishToDelete.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалить чужие желания');
    }

    await this.wishesRepository.delete({ id });
  }

  async copyWish(id: number, userId: number) {
    const wish = await this.findOne(id);
    const counter = wish.copied + 1;
    await this.wishesRepository.update(id, {
      copied: counter,
    });
    const user = await this.usersRepository.findOneBy({ id: userId });
    const copiedWish = {
      ...wish,
      owner: UserPublicResponseDto.getUser(user),
      copied: 0,
      raised: 0,
      offers: [],
    };
    delete copiedWish.id;
    return this.wishesRepository.save(copiedWish);
  }
}
