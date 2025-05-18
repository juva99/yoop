import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameParticipant } from './game-participants.entity';
import { GameParticipantsController } from './game-participants.controller';
import { GameParticipantsService } from './game-participants.service';
import { User } from 'src/users/users.entity';
import { Game } from 'src/games/games.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameParticipant, Game, User]), UsersModule],
  exports: [TypeOrmModule, GameParticipantsService],
  controllers: [GameParticipantsController],
  providers: [GameParticipantsService],
})
export class GameParticipantsModule {}
