import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameParticipant } from './game-participants.entity';
import { GameParticipantsController } from './game-participants.controller';
import { GameParticipantsService } from './game-participants.service';
import { Game } from 'src/games/games.entity';
import { UsersModule } from 'src/users/users.module';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameParticipant, Game]),
    UsersModule,
    forwardRef(() => GamesModule),
  ],
  exports: [TypeOrmModule, GameParticipantsService],
  controllers: [GameParticipantsController],
  providers: [GameParticipantsService],
})
export class GameParticipantsModule {}
