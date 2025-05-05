import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './games.entity';
import { Field } from 'src/fields/fields.entity';
import { GameParticipant } from 'src/game-participants/game-participants.entity';
import { WeatherApiModule } from 'src/weather-api/weather-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Field, GameParticipant]), WeatherApiModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
