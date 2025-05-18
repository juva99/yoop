import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendRelation } from './friends.entity';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRelation]), UsersModule],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}
