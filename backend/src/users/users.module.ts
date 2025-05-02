import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GameParticipant } from 'src/game-participants/game-participants.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([User, GameParticipant])], 
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
