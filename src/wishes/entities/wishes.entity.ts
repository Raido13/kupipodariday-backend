import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsInt,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { User } from '../../users/entities/users.entity';
import { Offer } from '../../offers/entities/offers.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  id: number;

  @CreateDateColumn()
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  link: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;

  @Column()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  price: number;

  @Column({ default: 0, nullable: true })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ nullable: true })
  @IsInt()
  copied: number;
}
