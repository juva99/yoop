import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './games.entity';
import { Field } from 'src/fields/fields.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Field])],
  controllers: [GamesController],
  providers: [GamesService]
})
export class GamesModule {}
