import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  findMe(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('me/wishes')
  findMyWishes(@Req() req) {
    return this.usersService.findMyWishes(req.user.id);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @Patch('me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('find')
  findMany(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto);
  }
}
