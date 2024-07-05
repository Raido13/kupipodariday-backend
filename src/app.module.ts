import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersService } from './offers/offers.service';
import { OffersController } from './offers/offers.controller';
import { OffersModule } from './offers/offers.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule, WishesModule, WishlistsModule, OffersModule, TypeOrmModule.forRoot()],
  controllers: [AppController, OffersController],
  providers: [OffersService],
})
export class AppModule {}
