import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GameParticipant } from 'src/game-participants/game-participants.entity';
import { FriendRelation } from 'src/friends/friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GameParticipant, FriendRelation])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
