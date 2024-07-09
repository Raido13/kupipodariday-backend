import { User } from '../entities/users.entity';

export class UserPublicResponseDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  about: string;
  avatar: string;

  static getUser(user: User): UserPublicResponseDto {
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
    };
  }
}
