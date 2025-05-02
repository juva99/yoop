import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameParticipant } from './game-participants.entity';
import { GameParticipantsController } from './game-participants.controller';
import { GameParticipantsService } from './game-participants.service';
import { User } from 'src/users/users.entity';
import { Game } from 'src/games/games.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameParticipant, Game, User])],
  exports: [TypeOrmModule],
  controllers: [GameParticipantsController],
  providers: [GameParticipantsService] 
})
export class GameParticipantsModule {}
