import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './games.entity';
import { WeatherApiModule } from 'src/weather-api/weather-api.module';
import { GameParticipantsModule } from 'src/game-participants/game-participants.module';
import { FieldsModule } from 'src/fields/fields.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    WeatherApiModule,
    GameParticipantsModule,
    FieldsModule
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
