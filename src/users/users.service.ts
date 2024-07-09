import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserWishesDto } from './dto/user-wishes.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const user = this.usersRepository.create({
      ...rest,
      password: await hashPassword(password),
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findUserWishes(username: string): Promise<UserWishesDto[]> {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['wishes'],
      relations: ['wishes'],
    });
    return user.wishes;
  }

  async findMyWishes(id: number): Promise<UserWishesDto[]> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['wishes'],
      relations: ['wishes'],
    });
    return user.wishes;
  }

  async update(id: number, user: UpdateUserDto) {
    const { password, ...rest } = user;
    if (password) {
      return this.usersRepository.update(id, {
        ...rest,
        password: await hashPassword(password),
      });
    } else {
      return this.usersRepository.update(id, user);
    }
  }

  async findMany(findUserDto: FindUserDto): Promise<UserResponseDto[]> {
    const usersByEmail = await this.usersRepository.findBy({
      email: findUserDto.query,
    });
    const userByName = await this.usersRepository.findBy({
      username: findUserDto.query,
    });
    const users: User[] = usersByEmail.concat(userByName);
    return users.map((user) => UserResponseDto.getUser(user));
  }
}
